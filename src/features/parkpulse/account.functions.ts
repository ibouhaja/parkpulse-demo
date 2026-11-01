import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Json } from '@/integrations/supabase/types';
import { initialState, type DemoState } from './data';
import { restoreState } from './session';
import { applyServerAction, canImport } from './account-rules';
import { arriveReservation, type Reservation } from './reservation-rules';

type Ctx = { supabase: any; userId: string };
type Row = { state: DemoState; version: number; import_decision: string | null };

async function loadRow({ supabase, userId }: Ctx): Promise<Row> {
  const read = async () => {
    const { data, error } = await supabase.from('parking_states').select('state,version,import_decision').eq('user_id', userId).maybeSingle();
    if (error) throw new Error('Parkdaten konnten nicht geladen werden.');
    return data as { state: Json; version: number; import_decision: string | null } | null;
  };
  let row = await read();
  if (!row) {
    // Caller is verified by requireSupabaseAuth; the row is created only for their own id.
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    await supabaseAdmin.from('parking_states').upsert({ user_id: userId, state: initialState as unknown as Json }, { onConflict: 'user_id', ignoreDuplicates: true });
    row = await read();
    if (!row) throw new Error('Parkdaten konnten nicht angelegt werden.');
  }
  return { state: restoreState(JSON.stringify(row.state)), version: row.version, import_decision: row.import_decision };
}

async function save(userId: string, version: number, patch: Record<string, unknown>) {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  if ('state' in patch && !('import_decision' in patch)) {
    const {data,error}=await supabaseAdmin.rpc('demo_save_state',{p_user:userId,p_version:version,p_state:patch['state'] as Json});
    if(error)throw new Error('Speichern fehlgeschlagen. Dieser Stellplatz ist möglicherweise reserviert.');
    if(!data)return false;
    return true;
  }
  const { data, error } = await supabaseAdmin
    .from('parking_states')
    .update({ ...patch, version: version + 1 })
    .eq('user_id', userId)
    .eq('version', version)
    .select('version');
  if (error) throw new Error('Speichern fehlgeschlagen.');
  return (data?.length ?? 0) > 0;
}

export const getAccountState = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const row = await loadRow(context as Ctx);
    return { state: row.state, canImport: canImport(row.state, row.import_decision) };
  });

export const applyAccountAction = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { action: unknown }) => input)
  .handler(async ({ data, context }) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      const row = await loadRow(context as Ctx);
      const result = applyServerAction(row.state, data.action, Date.now(), crypto.randomUUID());
      if (!result.changed) return { state: row.state, changed: false };
      if (await save(context.userId, row.version, { state: result.state as unknown as Json })) return { state: result.state, changed: true };
      // Another tab saved first: reload and re-apply against the latest state.
    }
    throw new Error('Gleichzeitige Änderung erkannt. Bitte erneut versuchen.');
  });

export const importLocalState = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { raw: string }) => {
    if (typeof input?.raw !== 'string' || input.raw.length > 200_000) throw new Error('Ungültige Demo-Daten');
    return input;
  })
  .handler(async ({ data, context }) => {
    const row = await loadRow(context as Ctx);
    if (!canImport(row.state, row.import_decision)) throw new Error('Für dieses Konto wurden bereits Daten übernommen oder angelegt.');
    let imported: DemoState;
    try {
      imported = restoreState(data.raw);
      // Browser legacy imports are not a source of trusted new tariffs or redeemable points.
      imported = {...imported,pointsBalance:0,pointsHistory:[],vouchers:imported.vouchers.filter(v=>v.source!=='points')};
      if(imported.session){const {tariff: _untrustedTariff,...legacySession}=imported.session;imported={...imported,session:legacySession};}
    } catch { throw new Error('Die lokalen Demo-Daten sind ungültig.'); }
    const ok = await save(context.userId, row.version, { state: imported as unknown as Json, import_decision: 'imported', imported_at: new Date().toISOString() });
    if (!ok) throw new Error('Gleichzeitige Änderung erkannt. Bitte erneut versuchen.');
    return { state: imported };
  });

export const declineLocalImport = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const row = await loadRow(context as Ctx);
    if (row.import_decision === null) await save(context.userId, row.version, { import_decision: 'declined' });
    return { ok: true };
  });

export const arriveBooking=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((input:{id:string})=>input).handler(async({context,data})=>{
  for(let attempt=0;attempt<3;attempt++){
    const row=await loadRow(context as Ctx);
    const {data:r,error}=await context.supabase.from('demo_reservations').select('*').eq('id',data.id).eq('user_id',context.userId).maybeSingle();
    if(error||!r)throw new Error('Reservierung wurde nicht gefunden.');
    if(r.status==='arrived'&&row.state.session?.id===r.session_id)return {state:row.state};
    const next=arriveReservation(row.state,r as Reservation,Date.now());
    if(next===row.state)throw new Error('Bitte schließe zuerst deine bestehende Parksession ab.');
    const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
    const {data:ok,error:saveError}=await supabaseAdmin.rpc('demo_save_state',{p_user:context.userId,p_version:row.version,p_state:next as unknown as Json,p_arrival:data.id});
    if(saveError)throw new Error('Ankunft konnte nicht gespeichert werden. Bitte lade deine Reservierungen neu.');
    if(ok)return {state:next};
  }
  throw new Error('Gleichzeitige Änderung. Bitte erneut versuchen.');
});
