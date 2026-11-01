import { tariffs } from './tariffs';
import { reservationPrice } from './map-rules';
import type { Json } from '@/integrations/supabase/types';
import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { bookingAllowed, type HeldPosition } from './reservation-rules';
import type { ParkingFilters } from './parking-plan';
import { z } from 'zod';
import type { CancellationQuote } from './cancellation-rules';

export const getHeldPositions = createServerFn({method:'GET'}).handler(async () => {
  const key=process.env['SUPABASE_PUBLISHABLE_KEY']; const url=process.env['SUPABASE_URL'];
  if(!key||!url) throw new Error('Demo-Verfügbarkeit konnte nicht geladen werden.');
  const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{const h=new Headers(init?.headers);if(key.startsWith('sb_')&&h.get('Authorization')===`Bearer ${key}`)h.delete('Authorization');h.set('apikey',key);return fetch(input,{...init,headers:h});}}});
  const {data,error}=await client.rpc('demo_held_positions');
  if(error)throw new Error('Demo-Verfügbarkeit konnte nicht geladen werden.');
  return (data??[]) as HeldPosition[];
});
export const getReservations=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const {error:reconcileError}=await supabaseAdmin.rpc('demo_reconcile_no_shows');
  if(reconcileError)throw new Error('Reservierungsstatus konnte nicht aktualisiert werden.');
  const {data,error}=await context.supabase.from('demo_reservations').select('id,facility_id,level,bay,starts_at,hours,price,status,session_id,tariff,reservation_status,grace_minutes,fee_cents,fee_percent,resolved_at').eq('user_id',context.userId).order('created_at',{ascending:false});
  if(error)throw new Error('Reservierungen konnten nicht geladen werden.');
  return data;
});
export const bookReservation=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((input:{id:string;facility:string;level:string;bay:string;startsAt:string;hours:number;filters:ParkingFilters;step?:number})=>{
  if(!input||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.id)||typeof input.facility!=='string'||typeof input.level!=='string'||typeof input.bay!=='string'||!input.filters?.needs)throw new Error('Bitte prüfe deine Reservierungsangaben.');
  return input;
}).handler(async({context,data})=>{
  const {data:held,error:heldError}=await context.supabase.rpc('demo_held_positions');
  if(heldError)throw new Error('Demo-Verfügbarkeit konnte nicht geprüft werden.');
  // A request replay must return the original reservation, not fail its own held-spot check.
  const {data:existing}=await context.supabase.from('demo_reservations').select('id').eq('user_id',context.userId).eq('id',data.id).maybeSingle();
  if(existing)return {id:existing.id};
  if(!bookingAllowed(data.facility,data.level,data.bay,data.hours,data.filters,held??[],data.step??0))throw new Error('Dieser Stellplatz ist nicht mehr frei oder passt nicht zu deinem Fahrzeug.');
  const start=Date.parse(data.startsAt);
  if(!Number.isFinite(start)||start<Date.now()-60000||start>Date.now()+365*86400000)throw new Error('Bitte wähle einen zukünftigen Termin innerhalb eines Jahres.');
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const {error}=await supabaseAdmin.rpc('demo_book_spot_priced',{p_id:data.id,p_user:context.userId,p_facility:data.facility,p_level:data.level,p_bay:data.bay,p_start:new Date(start).toISOString(),p_hours:data.hours,p_price:reservationPrice(data.hours,data.facility,start)??-1,p_tariff:tariffs[data.facility] as unknown as Json});
  if(error)throw new Error('Dieser Stellplatz konnte nicht reserviert werden. Er ist möglicherweise bereits vergeben.');
  return {id:data.id};
});
export const quoteCancellation=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({id:z.string().uuid()})).handler(async({context,data})=>{
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const {data:quote,error}=await supabaseAdmin.rpc('demo_quote_cancellation',{p_user:context.userId,p_id:data.id});
  if(error)throw new Error('Diese Reservierung kann nicht mehr storniert werden. Bitte aktualisiere den Verlauf.');
  return quote as unknown as CancellationQuote;
});
export const cancelReservation=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator(z.object({quoteId:z.string().uuid(),confirmed:z.literal(true)})).handler(async({context,data})=>{
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const {data:result,error}=await supabaseAdmin.rpc('demo_confirm_cancellation',{p_user:context.userId,p_quote:data.quoteId});
  if(error)throw new Error('Die Gebührenvorschau ist abgelaufen oder der Status hat sich geändert. Bitte prüfe die Gebühr erneut.');
  return result;
});