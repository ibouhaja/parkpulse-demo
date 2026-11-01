import { facilities, type Facility } from './data';
import { matchesSpot, type ParkingFilters, type ParkingSpot } from './parking-plan';

export const facilityOffers: Record<string, { points: number; shopping: string; hours: string }> = {
  quartier: { points: 100, shopping: 'Quartier-Bummel · SHOP2: einmalig bis zu 2 €', hours: 'Täglich 00–24 Uhr' },
  ufer: { points: 80, shopping: '', hours: 'Täglich 00–24 Uhr' },
  stadtgarten: { points: 60, shopping: '', hours: 'Täglich 00–24 Uhr' },
  werk: { points: 120, shopping: 'Westend-Shopping · SHOP2: einmalig bis zu 2 €', hours: 'Täglich 00–24 Uhr' },
  markt: { points: 150, shopping: 'Marktforum-Aktion · SHOP2: einmalig bis zu 2 €', hours: 'Täglich 00–24 Uhr' },
  nord: { points: 50, shopping: '', hours: 'Täglich 00–24 Uhr' },
};
export const bonusFor = (id: string) => facilityOffers[id]?.points ?? 100;
export function facilityAvailability(spots: ParkingSpot[], filters: ParkingFilters) {
  const free = spots.filter(s => !s.occupied && !s.unknown);
  const matching = free.filter(s => matchesSpot(s, filters));
  return { total: spots.length, free: free.length, matching: matching.length,
    wallbox: free.filter(s => s.charging).length, family: free.filter(s => s.category === 'family').length,
    women: free.filter(s => s.category === 'women').length, accessible: free.filter(s => s.accessible).length };
}
export function mapFacilities(plans: Record<string, { spots: ParkingSpot[] }>, filters: ParkingFilters, query: string, min20: boolean, shopping: boolean, cheapest: boolean): Facility[] {
  const q = query.trim().toLocaleLowerCase('de');
  return facilities.filter(p => {
    const a = facilityAvailability(plans[p.id]?.spots ?? [], filters);
    return a.matching >= (min20 ? 20 : 1) && (!shopping || !!facilityOffers[p.id]?.shopping) && `${p.name} ${p.address} ${p.area}`.toLocaleLowerCase('de').includes(q);
  }).sort((a,b) => cheapest ? a.price-b.price || a.distance-b.distance : a.distance-b.distance);
}
export function reservationPrice(hours: number) {
  return Number.isFinite(hours) && hours > 0 && hours <= 72 ? Math.ceil(hours) * 2 : null;
}