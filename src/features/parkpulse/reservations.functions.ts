import { createServerFn } from '@tanstack/react-start';
import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { bookingAllowed, type HeldPosition } from './reservation-rules';
import type { ParkingFilters } from './parking-plan';

export const getHeldPositions = createServerFn({method:'GET'}).handler(async () => {
  const key=process.env['SUPABASE_PUBLISHABLE_KEY']; const url=process.env['SUPABASE_URL'];
  if(!key||!url) throw new Error('Demo-Verfügbarkeit konnte nicht geladen werden.');
  const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{fetch:(input,init)=>{const h=new Headers(init?.headers);if(key.startsWith('sb_')&&h.get('Authorization')===`Bearer ${key}`)h.delete('Authorization');h.set('apikey',key);return fetch(input,{...init,headers:h});}}});
  const {data,error}=await client.rpc('demo_held_positions');
  if(error)throw new Error('Demo-Verfügbarkeit konnte nicht geladen werden.');
  return (data??[]) as HeldPosition[];
});
export const getReservations=createServerFn({method:'GET'}).middleware([requireSupabaseAuth]).handler(async({context})=>{
  const {data,error}=await context.supabase.from('demo_reservations').select('id,facility_id,level,bay,starts_at,hours,price,status,session_id').eq('user_id',context.userId).order('created_at',{ascending:false});
  if(error)throw new Error('Reservierungen konnten nicht geladen werden.');
  return data;
});
export const bookReservation=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((input:{id:string;facility:string;level:string;bay:string;startsAt:string;hours:number;filters:ParkingFilters})=>{
  if(!input||!/^[-0-9a-f]{36}$/i.test(input.id)||typeof input.facility!=='string'||typeof input.level!=='string'||typeof input.bay!=='string'||!input.filters?.needs)throw new Error('Bitte prüfe deine Reservierungsangaben.');
  return input;
}).handler(async({context,data})=>{
  const {data:held,error:heldError}=await context.supabase.rpc('demo_held_positions');
  if(heldError)throw new Error('Demo-Verfügbarkeit konnte nicht geprüft werden.');
  // A request replay must return the original reservation, not fail its own held-spot check.
  const {data:existing}=await context.supabase.from('demo_reservations').select('id').eq('user_id',context.userId).eq('id',data.id).maybeSingle();
  if(existing)return {id:existing.id};
  if(!bookingAllowed(data.facility,data.level,data.bay,data.hours,data.filters,held??[]))throw new Error('Dieser Stellplatz ist nicht mehr frei oder passt nicht zu deinem Fahrzeug.');
  const start=Date.parse(data.startsAt);
  if(!Number.isFinite(start)||start<Date.now()-60000||start>Date.now()+365*86400000)throw new Error('Bitte wähle einen zukünftigen Termin innerhalb eines Jahres.');
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const {error}=await supabaseAdmin.rpc('demo_book_spot',{p_id:data.id,p_user:context.userId,p_facility:data.facility,p_level:data.level,p_bay:data.bay,p_start:new Date(start).toISOString(),p_hours:data.hours});
  if(error)throw new Error('Dieser Stellplatz konnte nicht reserviert werden. Er ist möglicherweise bereits vergeben.');
  return {id:data.id};
});
export const cancelReservation=createServerFn({method:'POST'}).middleware([requireSupabaseAuth]).inputValidator((input:{id:string})=>input).handler(async({context,data})=>{
  const {supabaseAdmin}=await import('@/integrations/supabase/client.server');
  const {data:changed,error}=await supabaseAdmin.rpc('demo_cancel_booking',{p_user:context.userId,p_id:data.id});
  if(error)throw new Error('Stornierung fehlgeschlagen. Bitte versuche es erneut.');
  return {changed};
});