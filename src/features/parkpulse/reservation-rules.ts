import type { DemoState } from './data';
import { transition } from './session';
import { createParkingPlan, simulateOccupancy, selectFreeSpot, type ParkingFilters } from './parking-plan';
import { reservationPrice } from './map-rules';

export type Reservation = { id: string; facility_id: string; level: string; bay: string; starts_at: string; hours: number; price: number; status: 'booked'|'arrived'|'cancelled'|'completed'; session_id: string|null };
export type HeldPosition = { facility_id: string; level: string; bay: string };
export function bookingAllowed(facility: string, level: string, bay: string, hours: number, filters: ParkingFilters, held: HeldPosition[], step=0) {
  if(!Number.isInteger(step)||step<0||step>100000)return false;
  const base=createParkingPlan(facility);
  const spot = (step?simulateOccupancy(base,step-1):base).find(s => s.level === level && s.bay === bay);
  return !!spot && reservationPrice(hours) !== null && !held.some(h => h.facility_id===facility && h.level===level && h.bay===bay) && !!selectFreeSpot([spot], spot, filters);
}
export function arriveReservation(state: DemoState, r: Reservation, now: number): DemoState {
  if (state.session || r.status !== 'booked') return state;
  const started = transition(state,{type:'start',facilityId:r.facility_id,id:r.id,now});
  if (!started.session) return state;
  return transition(started,{type:'location',level:r.level,bay:r.bay,sessionId:r.id});
}
export const canCancelReservation = (r: Reservation) => r.status==='booked';