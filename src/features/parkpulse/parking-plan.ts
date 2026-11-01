import { facilities, type DemoState } from './data';
import { transition } from './session';

export const parkingLevels = ['P1', 'P2', 'P3'] as const;
export const spotsPerLevel = 48;
export type ParkingLevel = typeof parkingLevels[number];
export const categoryLabels = { standard: 'Standardparkplatz', ev: 'E-Auto-Parkplatz', family: 'Familienparkplatz', women: 'Frauenparkplatz', accessible: 'Barrierefreier Parkplatz', van: 'Transporter-Stellplatz', truck: 'LKW-Stellplatz' } as const;
export type SpotCategory = keyof typeof categoryLabels;
export const vehicleLabels = { car: 'PKW', ev: 'E-Auto', suv: 'SUV', van: 'Transporter', truck: 'LKW' } as const;
export type VehicleType = keyof typeof vehicleLabels;
export type Needs = { wallbox: boolean; family: boolean; women: boolean; accessible: boolean };
export type ParkingFilters = { vehicle: VehicleType; height: number; length: number; width: number; weight: number; needs: Needs };
export const vehicleDefaults: Record<VehicleType, Omit<ParkingFilters, 'vehicle' | 'needs'>> = {
  car: { height: 1.6, length: 4.5, width: 1.8, weight: 2000 },
  ev: { height: 1.7, length: 4.7, width: 1.9, weight: 2400 },
  suv: { height: 1.9, length: 4.9, width: 2, weight: 2700 },
  van: { height: 2.6, length: 6, width: 2.1, weight: 3500 },
  truck: { height: 3.8, length: 10, width: 2.5, weight: 12000 },
};
export const defaultFilters: ParkingFilters = { vehicle: 'car', ...vehicleDefaults.car, needs: { wallbox: false, family: false, women: false, accessible: false } };
export type ParkingSpot = { level: ParkingLevel; bay: string; occupied: boolean; unknown: boolean; category: SpotCategory; maxHeight: number | null; length: number; width: number; maxWeight: number; charging: { power: number; connector: 'Typ 2' | 'CCS'; mode: 'AC' | 'DC' } | null; accessible: boolean; lighting: boolean; security: string; exitDistance: number; exitType: 'Ausgang' | 'Aufzug'; heavySuitable: boolean };
export type ParkingPosition = Pick<ParkingSpot, 'level' | 'bay'>;

// Illustrative subset, not the facility's total capacity or live availability.
export function createParkingPlan(facilityId: string): ParkingSpot[] {
  const index = facilities.findIndex(p => p.id === facilityId);
  if (index < 0) return [];
  const facility = facilities[index];
  if (!facility) return [];
  const open = facility.kind === 'Parkplatz';
  const entrance = open ? null : Number(facility.height.replace(',', '.').split(' ')[0]);
  return parkingLevels.flatMap((level, floor) => Array.from({ length: spotsPerLevel }, (_, n) => {
    const types: SpotCategory[] = ['standard', 'ev', 'family', 'women', 'accessible', 'standard', 'van', 'truck'];
    let category = types[n % 8] ?? 'standard';
    if (category === 'ev' && facility.ev === 0) category = 'standard';
    if ((category === 'van' || category === 'truck') && (!open || floor !== 0)) category = 'standard';
    const charging = category === 'ev' ? { power: n < 8 ? 11 : n < 16 ? 22 : 50, connector: n < 16 ? 'Typ 2' as const : 'CCS' as const, mode: n < 16 ? 'AC' as const : 'DC' as const } : null;
    return {
      level, bay: `B${String(n + 1).padStart(2, '0')}`,
      occupied: ((n * 17 + floor * 7 + index * 11) % spotsPerLevel) < 17, unknown: false,
      category, maxHeight: entrance, length: category === 'truck' ? 12 : category === 'van' ? 7 : category === 'standard' ? 5 : 5.5,
      width: category === 'truck' ? 3.5 : category === 'van' ? 3 : category === 'family' || category === 'accessible' ? 3.5 : 2.5,
      maxWeight: category === 'truck' ? 18000 : category === 'van' ? 3500 : 3000,
      charging, accessible: category === 'accessible' || category === 'family', lighting: true,
      security: category === 'women' ? 'Nahe Notrufpunkt · beleuchteter Zugangsweg (fiktiv)' : 'Beleuchteter Zugangsweg · Notrufpunkt (fiktiv)',
      exitDistance: category === 'accessible' ? 8 : category === 'women' ? 12 : category === 'family' ? 15 : 20 + n * 3,
      exitType: open ? 'Ausgang' as const : 'Aufzug' as const, heavySuitable: open && floor === 0,
    };
  }));
}

export function protectSessionPosition(spots: ParkingSpot[], position?: Pick<ParkingPosition, 'bay'> & { level: string } | null): ParkingSpot[] {
  if (!position?.level || !position.bay) return spots;
  const bay = position.bay.trim().replace(/^B0*(\d+)$/i, (_, n: string) => `B${n.padStart(2, '0')}`);
  return spots.map(spot => spot.level === position.level.trim().toUpperCase() && spot.bay === bay ? { ...spot, occupied: true, unknown: false } : spot);
}

export function occupancyStats(spots: ParkingSpot[]) {
  const total = spots.length;
  const unknown = spots.filter(s => s.unknown).length;
  const occupied = spots.filter(s => s.occupied && !s.unknown).length;
  return { total, free: total - occupied - unknown, occupied, unknown, percent: total ? Math.round(occupied / total * 100) : 0 };
}

export function simulateOccupancy(spots: ParkingSpot[], step: number, position?: { level: string; bay: string } | null): ParkingSpot[] {
  // Move a bounded fraction of vehicles; preserve a balanced occupancy instead of toggling toward 50%.
  const next = spots.map((spot, index) => {
    const floor = Math.floor(index / spotsPerLevel);
    const n = index % spotsPerLevel;
    const occupied = ((n * 17 + floor * 7 + (step + 1) * 13) % spotsPerLevel) < 17;
    const unknown = !occupied && (index + step * 7) % 47 === 46;
    return { ...spot, occupied, unknown };
  });
  return protectSessionPosition(next, position);
}

export function matchesSpot(spot: ParkingSpot, filters: ParkingFilters): boolean {
  if (![filters.height, filters.length, filters.width, filters.weight].every(v => Number.isFinite(v) && v > 0)) return false;
  if ((spot.maxHeight !== null && filters.height > spot.maxHeight) || filters.length > spot.length || filters.width > spot.width || filters.weight > spot.maxWeight) return false;
  if ((filters.vehicle === 'van' || filters.vehicle === 'truck') && !spot.heavySuitable) return false;
  if (filters.vehicle === 'truck' && spot.category !== 'truck') return false;
  if (filters.vehicle === 'van' && !['van', 'truck'].includes(spot.category)) return false;
  if (filters.vehicle !== 'truck' && filters.vehicle !== 'van' && ['van', 'truck'].includes(spot.category)) return false;
  if (filters.needs.wallbox && (!spot.charging || filters.vehicle !== 'ev')) return false;
  if (spot.category === 'ev' && filters.vehicle !== 'ev') return false;
  return (!filters.needs.family || spot.category === 'family') && (!filters.needs.women || spot.category === 'women') && (!filters.needs.accessible || spot.accessible);
}

export function selectFreeSpot(spots: ParkingSpot[], position: ParkingPosition, filters?: ParkingFilters): ParkingPosition | null {
  const spot = spots.find(s => s.level === position.level && s.bay === position.bay);
  return spot && !spot.occupied && !spot.unknown && (!filters || matchesSpot(spot, filters)) ? { level: spot.level, bay: spot.bay } : null;
}

export function savePlanPosition(state: DemoState, facilityId: string, spots: ParkingSpot[], position: ParkingPosition, filters?: ParkingFilters): DemoState {
  if (state.session?.status !== 'active' || state.session.facilityId !== facilityId) return state;
  const selected = selectFreeSpot(spots, position, filters);
  return selected ? transition(state, { type: 'location', ...selected, sessionId: state.session.id }) : state;
}