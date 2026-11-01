import { tariffs, legacyTariff, tariffFeeCents } from './tariffs';
import { facilities, type Facility } from './data';
import { matchesSpot, type ParkingFilters, type ParkingSpot } from './parking-plan';

export const facilityOffers: Record<string, { points: number; shopping: string; hours: string }> = {
  quartier: { points: 450, shopping: 'Quartier-Bummel · SHOP2: einmalig bis zu 2 €', hours: 'Täglich 00–24 Uhr' },
  ufer: { points: 750, shopping: '', hours: 'Täglich 00–24 Uhr' },
  stadtgarten: { points: 300, shopping: 'Stadtgarten-Shopping · bis 1 € Demo-Rabatt', hours: 'Täglich 00–24 Uhr' },
  werk: { points: 1200, shopping: 'Westend-Shopping · SHOP2: einmalig bis zu 2 €', hours: 'Täglich 00–24 Uhr' },
  markt: { points: 1000, shopping: 'Marktforum-Aktion · SHOP2: einmalig bis zu 2 €', hours: 'Täglich 00–24 Uhr' },
  nord: { points: 500, shopping: '', hours: 'Täglich 00–24 Uhr' },
};
export const bonusFor = (id: string) => tariffs[id]?.referencePoints ?? 0;
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
export function reservationPrice(hours: number, facility?: string, startedAt = Date.UTC(2026,10,1,9)) {
  return Number.isFinite(hours) && hours > 0 && hours <= 72 ? tariffFeeCents(facility?tariffs[facility]??legacyTariff:legacyTariff,startedAt,hours*3600000)/100 : null;
}