import type { Reservation } from './reservation-rules';

export const NO_SHOW_GRACE_MINUTES = 15;
export const reservationStatusLabels = { confirmed: 'Bestätigt', cancelled: 'Storniert', checked_in: 'Eingecheckt', completed: 'Abgeschlossen', no_show: 'No-Show' };
export const reservationStatusLabelsEn: Record<keyof typeof reservationStatusLabels, string> = { confirmed: 'Confirmed', cancelled: 'Cancelled', checked_in: 'Checked in', completed: 'Completed', no_show: 'No-show' };
export type ReservationStatus = keyof typeof reservationStatusLabels;
export function reservationStatus(r: Reservation): ReservationStatus {
  return r.reservation_status ?? ({ booked: 'confirmed', arrived: 'checked_in', cancelled: 'cancelled', completed: 'completed' } as const)[r.status];
}
// More than 2h: free. Exactly 2h and exactly 1h belong to 50%; under 1h 100%.
export function cancellationPercent(startsAt: string, now: number): 0 | 50 | 100 {
  const remaining = Date.parse(startsAt) - now;
  if (!Number.isFinite(remaining)) throw new Error('Ungültiger Reservierungstermin.');
  return remaining > 2 * 3600000 ? 0 : remaining >= 3600000 ? 50 : 100;
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
export type BatchQuoteItem = { id: string; reservationId: string; facilityId: string; level: string; bay: string; startsAt: string; hours: number; price: number; percent: number; feeCents: number };
export type CancellationBatchQuote = { batchId: string; items: BatchQuoteItem[]; totalFeeCents: number; expiresAt: number };
export function batchTotalCents(items: Pick<BatchQuoteItem,'price'|'percent'>[]) {
  return items.reduce((sum, i) => sum + cancellationFeeCents(i.price, i.percent), 0);
}
export function validBatchConfirmation(quote: CancellationBatchQuote, confirmationId: string | undefined, now: number) {
  return quote.items.length > 0 && confirmationId === quote.batchId && now <= quote.expiresAt
    && quote.items.every(i => i.feeCents === cancellationFeeCents(i.price, i.percent))
    && quote.totalFeeCents === batchTotalCents(quote.items);
}
export type RescheduleOffer = { id: string; reservationId: string; cancellation: CancellationBatchQuote; facility: string; level: string; bay: string; startsAt: string; hours: number; price: number; expiresAt: number };
export function validRescheduleConfirmation(o: RescheduleOffer, confirmationId: string | undefined, now: number) {
  return confirmationId === o.id && now <= o.expiresAt && o.cancellation.items.length === 1
    && o.cancellation.items[0]!.reservationId === o.reservationId && validBatchConfirmation(o.cancellation, o.cancellation.batchId, now);
}
