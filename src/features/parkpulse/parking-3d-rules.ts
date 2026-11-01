import { matchesSpot, type ParkingFilters, type ParkingLevel, type ParkingSpot } from './parking-plan';

export const demoModels = ['compact', 'sedan', 'suv', 'van'] as const;
export type DemoModel = typeof demoModels[number];
export const demoModelLabels: Record<DemoModel, string> = { compact: 'Kleinwagen', sedan: 'Limousine', suv: 'SUV', van: 'Transporter' };
export const demoModelDimensions = {
  compact: { vehicle: 'car', height: 1.5, length: 3.8, width: 1.7, weight: 1500 },
  sedan: { vehicle: 'car', height: 1.6, length: 4.5, width: 1.8, weight: 2000 },
  suv: { vehicle: 'suv', height: 1.9, length: 4.9, width: 2, weight: 2700 },
  van: { vehicle: 'van', height: 2.6, length: 6, width: 2.1, weight: 3500 },
} as const;
export function filtersForModel(filters: ParkingFilters, model: DemoModel): ParkingFilters {
  return { ...filters, ...demoModelDimensions[model] };
}
export function sceneSpots(spots: ParkingSpot[], level: ParkingLevel, filters: ParkingFilters) {
  return spots.filter(spot => spot.level === level && matchesSpot(spot, filters));
}
export function spotCoordinates(bay: string): { x: number; z: number; yaw: number } {
  const index = Math.max(0, Math.min(47, Number(bay.replace(/^B/i, '')) - 1));
  const row = Math.floor(index / 12);
  return { x: (index % 12 - 5.5) * 3.7, z: [-12, -3.8, 3.8, 12][row] ?? 0, yaw: row % 2 === 0 ? Math.PI : 0 };
}
export const PARKING_ANIMATION_SECONDS = 3;
export function parkingPose(bay: string, progress: number) {
  const target = spotCoordinates(bay);
  const t = Math.max(0, Math.min(1, progress));
  const ease = t * t * (3 - 2 * t);
  const direction = target.yaw === 0 ? -1 : 1;
  return { x: target.x - 4 * (1 - ease), z: target.z + direction * 6 * (1 - ease), yaw: target.yaw + Math.PI / 2 * (1 - ease) };
}