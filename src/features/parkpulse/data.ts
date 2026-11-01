export type Facility = { id: string; name: string; area: string; address: string; price: number; distance: number; spaces: number; total: number; ev: number; height: string; kind: string; rating: string };
export const facilities: Facility[] = [
  { id: 'quartier', name: 'Parkhaus am Quartier', area: 'Mitte', address: 'Quartierstraße 12, 10100 Demostadt', price: 1.49, distance: 0.4, spaces: 84, total: 240, ev: 12, height: '2,10 m', kind: 'Parkhaus', rating: '4,8' },
  { id: 'ufer', name: 'Uferpark Garage', area: 'Hafenviertel', address: 'Uferpromenade 8, 10100 Demostadt', price: 1.99, distance: 0.8, spaces: 42, total: 180, ev: 8, height: '2,00 m', kind: 'Tiefgarage', rating: '4,6' },
  { id: 'stadtgarten', name: 'Parkplatz Stadtgarten', area: 'Gartenviertel', address: 'Gartenweg 24, 10100 Demostadt', price: 0.99, distance: 1.2, spaces: 126, total: 200, ev: 0, height: 'Ohne Begrenzung', kind: 'Parkplatz', rating: '4,5' },
  { id: 'werk', name: 'Mobilitätshaus West', area: 'Westend', address: 'Werkstraße 6, 10100 Demostadt', price: 2.49, distance: 1.6, spaces: 63, total: 300, ev: 24, height: '2,20 m', kind: 'Parkhaus', rating: '4,9' },
  { id: 'markt', name: 'Tiefgarage Marktforum', area: 'Altstadt', address: 'Marktallee 3, 10100 Demostadt', price: 2.99, distance: 0.6, spaces: 18, total: 120, ev: 0, height: '1,95 m', kind: 'Tiefgarage', rating: '4,4' },
  { id: 'nord', name: 'Park & Ride Nordlicht', area: 'Nordviertel', address: 'Nordring 40, 10100 Demostadt', price: 1.29, distance: 2.4, spaces: 152, total: 220, ev: 6, height: 'Ohne Begrenzung', kind: 'Parkplatz', rating: '4,7' },
];
export function findFacilities(query: string, evOnly: boolean, sort = 'distance') {
  const term = query.trim().toLocaleLowerCase('de');
  return facilities.filter(p => (!evOnly || p.ev > 0) && `${p.name} ${p.area} ${p.address}`.toLocaleLowerCase('de').includes(term)).sort((a,b) => sort === 'price' ? a.price-b.price : a.distance-b.distance);
}
export const money = (value: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value);
export type Session = { id: string; facilityId: string; facilityName: string; startedAt: number; effectiveDemoTime: number; demoOffsetMs: number; level: string; bay: string; status: 'active' | 'checkout-pending'; endedAt?: number; finalDurationMs?: number; finalFee?: number; discount?: 'none' | 'SHOP2' | 'voucher' | 'shopping'; voucherId?: string | undefined; tariff?: import('./tariffs').Tariff };
export type HistoryEntry = { id: string; facilityId: string; date: string; minutes: number; cost: number; session?: Session; level?: string; bay?: string; receiptId?: string; originalFee?: number; discountAmount?: number; stampEarned?: boolean; bonusPoints?: number; pointsBalance?: number; pointsHistory?: import('./points').PointEntry[] };
export type Voucher = { id: string; value: number; earnedSessionId: string; usedSessionId?: string; source?: 'points'; pointsSpent?: number };
export type PayMethod = 'card' | 'paypal' | 'klarna' | 'visa' | 'bitcoin';
export const payMethodLabel: Record<PayMethod, string> = { card: 'Demo-Karte', paypal: 'PayPal', klarna: 'Klarna', visa: 'Visa', bitcoin: 'Bitcoin (BTC)' };
export type Receipt = { id: string; sessionId: string; date: string; originalFee: number; discountAmount: number; payable: number; discount: string; payment: 'success' | 'free'; method?: PayMethod; level: string; bay: string };
export type DemoState = { session: Session | null; history: HistoryEntry[]; stamps: number; vouchers: Voucher[]; shop2Used: boolean; receipts: Receipt[]; schemaVersion: 2; bonusPoints?: number; pointsBalance?: number; pointsHistory?: import('./points').PointEntry[] };
export const initialState: DemoState = { session: null, stamps: 5, vouchers: [], shop2Used: false, receipts: [], schemaVersion: 2, pointsBalance: 0, pointsHistory: [], history: [
  { id: 'sample-1', facilityId: 'quartier', date: '2026-10-28T10:00:00', minutes: 90, cost: 4 },
  { id: 'sample-2', facilityId: 'ufer', date: '2026-10-25T14:00:00', minutes: 120, cost: 4 },
  { id: 'sample-3', facilityId: 'stadtgarten', date: '2026-10-22T09:00:00', minutes: 60, cost: 2 },
] };
export function sessionCost(startedAt: number, now: number) { return Math.ceil(Math.max(0, now-startedAt) / 3600000) * 2; }
