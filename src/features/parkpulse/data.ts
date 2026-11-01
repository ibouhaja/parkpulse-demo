export type Facility = { id: string; name: string; area: string; address: string; price: number; distance: number; spaces: number; total: number; ev: number; height: string; kind: string; rating: string };
export const facilities: Facility[] = [
  { id: 'quartier', name: 'Parkhaus am Quartier', area: 'Mitte', address: 'Quartierstraße 12, 10100 Demostadt', price: 2.5, distance: 0.4, spaces: 84, total: 240, ev: 12, height: '2,10 m', kind: 'Parkhaus', rating: '4,8' },
  { id: 'ufer', name: 'Uferpark Garage', area: 'Hafenviertel', address: 'Uferpromenade 8, 10100 Demostadt', price: 2, distance: 0.8, spaces: 42, total: 180, ev: 8, height: '2,00 m', kind: 'Tiefgarage', rating: '4,6' },
  { id: 'stadtgarten', name: 'Parkplatz Stadtgarten', area: 'Gartenviertel', address: 'Gartenweg 24, 10100 Demostadt', price: 1.5, distance: 1.2, spaces: 126, total: 200, ev: 0, height: 'Ohne Begrenzung', kind: 'Parkplatz', rating: '4,5' },
  { id: 'werk', name: 'Mobilitätshaus West', area: 'Westend', address: 'Werkstraße 6, 10100 Demostadt', price: 2.8, distance: 1.6, spaces: 63, total: 300, ev: 24, height: '2,20 m', kind: 'Parkhaus', rating: '4,9' },
  { id: 'markt', name: 'Tiefgarage Marktforum', area: 'Altstadt', address: 'Marktallee 3, 10100 Demostadt', price: 3, distance: 0.6, spaces: 18, total: 120, ev: 0, height: '1,95 m', kind: 'Tiefgarage', rating: '4,4' },
  { id: 'nord', name: 'Park & Ride Nordlicht', area: 'Nordviertel', address: 'Nordring 40, 10100 Demostadt', price: 1, distance: 2.4, spaces: 152, total: 220, ev: 6, height: 'Ohne Begrenzung', kind: 'Parkplatz', rating: '4,7' },
];
export function findFacilities(query: string, evOnly: boolean, sort = 'distance') {
  const term = query.trim().toLocaleLowerCase('de');
  return facilities.filter(p => (!evOnly || p.ev > 0) && `${p.name} ${p.area} ${p.address}`.toLocaleLowerCase('de').includes(term)).sort((a,b) => sort === 'price' ? a.price-b.price : a.distance-b.distance);
}
export const money = (value: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
export type Session = { facilityId: string; startedAt: number };
export type HistoryEntry = { id: string; facilityId: string; date: string; minutes: number; cost: number };
export type DemoState = { session: Session | null; history: HistoryEntry[]; points: number; redeemed: string[] };
export const initialState: DemoState = { session: null, points: 240, redeemed: [], history: [
  { id: 'sample-1', facilityId: 'quartier', date: '2026-10-28T10:00:00', minutes: 90, cost: 3.75 },
  { id: 'sample-2', facilityId: 'ufer', date: '2026-10-25T14:00:00', minutes: 120, cost: 4 },
  { id: 'sample-3', facilityId: 'stadtgarten', date: '2026-10-22T09:00:00', minutes: 60, cost: 1.5 },
] };
export function sessionCost(startedAt: number, now: number, hourly: number) { return Math.round(Math.max(0, now-startedAt) / 3600000 * hourly * 100) / 100; }
export const rewards = [{ id:'coffee', name:'Eine kleine Kaffeepause', cost:150, description:'Virtueller Kaffee-Gutschein', icon:'coffee' },{ id:'parking', name:'30 Minuten Parkzeit', cost:300, description:'Virtueller Parkzeit-Gutschein', icon:'parking' },{ id:'charge', name:'Energie für unterwegs', cost:500, description:'Virtueller Lade-Gutschein', icon:'charge' }];
