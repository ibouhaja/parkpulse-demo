import type { Reservation } from './reservation-rules';

export const NO_SHOW_GRACE_MINUTES = 15;
export const reservationStatusLabels = { confirmed: 'Bestätigt', cancelled: 'Storniert', checked_in: 'Eingecheckt', completed: 'Abgeschlossen', no_show: 'No-Show' };
export type ReservationStatus = keyof typeof reservationStatusLabels;
export function reservationStatus(r: Reservation): ReservationStatus {
  return r.reservation_status ?? ({ booked: 'confirmed', arrived: 'checked_in', cancelled: 'cancelled', completed: 'completed' } as const)[r.status];
}
// Exact boundaries: 3h and 2h belong to 25%; exactly 1h belongs to 50%.
export function cancellationPercent(startsAt: string, now: number): 0 | 25 | 50 | 100 {
  const remaining = Date.parse(startsAt) - now;
  if (!Number.isFinite(remaining)) throw new Error('Ungültiger Reservierungstermin.');
  return remaining > 3 * 3600000 ? 0 : remaining >= 2 * 3600000 ? 25 : remaining >= 3600000 ? 50 : 100;
}
export function cancellationFeeCents(price: number, percent: number) {
  if (!Number.isFinite(price) || price < 0 || ![0,25,50,100].includes(percent)) throw new Error('Ungültige Demo-Gebühr.');
  return Math.round(Math.round(price * 100) * percent / 100);
}
export function noShowDue(r: Reservation, now: number) {
  return reservationStatus(r) === 'confirmed' && now >= Date.parse(r.starts_at) + (r.grace_minutes ?? NO_SHOW_GRACE_MINUTES) * 60000;
}
export type CancellationQuote = { id: string; reservationId: string; price: number; percent: number; feeCents: number; expiresAt: number };
export function validCancellationConfirmation(quote: CancellationQuote, confirmationId: string | undefined, now: number) {
  return confirmationId === quote.id && now <= quote.expiresAt && quote.feeCents === cancellationFeeCents(quote.price, quote.percent);
}