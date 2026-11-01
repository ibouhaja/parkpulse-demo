import { facilities, type DemoState } from './data';
import { transition } from './session';

export const parkingLevels = ['P1', 'P2', 'P3'] as const;
export type ParkingLevel = typeof parkingLevels[number];
export type ParkingSpot = { level: ParkingLevel; bay: string; occupied: boolean };
export type ParkingPosition = Pick<ParkingSpot, 'level' | 'bay'>;

// Illustrative subset, not the facility's total capacity or live availability.
export function createParkingPlan(facilityId: string): ParkingSpot[] {
  const index = facilities.findIndex(p => p.id === facilityId);
  if (index < 0) return [];
  return parkingLevels.flatMap((level, floor) => Array.from({ length: 24 }, (_, n) => ({
    level, bay: `B${String(n + 1).padStart(2, '0')}`,
    occupied: (n + floor * 3 + index) % 5 < 2,
  })));
}

export function simulateOccupancy(spots: ParkingSpot[], step: number): ParkingSpot[] {
  return spots.map((spot, index) => (index + step) % 4 === 0 ? { ...spot, occupied: !spot.occupied } : spot);
}

export function selectFreeSpot(spots: ParkingSpot[], position: ParkingPosition): ParkingPosition | null {
  const spot = spots.find(s => s.level === position.level && s.bay === position.bay);
  return spot && !spot.occupied ? { level: spot.level, bay: spot.bay } : null;
}

export function savePlanPosition(state: DemoState, facilityId: string, spots: ParkingSpot[], position: ParkingPosition): DemoState {
  if (state.session?.status !== 'active' || state.session.facilityId !== facilityId) return state;
  const selected = selectFreeSpot(spots, position);
  return selected ? transition(state, { type: 'location', ...selected, sessionId: state.session.id }) : state;
}