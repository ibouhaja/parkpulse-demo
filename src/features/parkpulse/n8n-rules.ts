// Pure, runtime-agnostic rules for the n8n demo integration (Web Crypto only, works on Workers).
import { facilities } from './data';
export const N8N_MAX_ATTEMPTS = 8;
export const N8N_TIMEOUT_MS = 5000;

/** Exponential backoff: 1, 2, 4, 8 … minutes, capped at 60 minutes. */
export function retryDelayMs(attempts: number) {
  return Math.min(60, 2 ** Math.max(0, attempts - 1)) * 60000;
}
/** 2xx = sent; 408/429/5xx/network = retry; other 4xx = permanent failure (bad URL/auth). */
export function deliveryOutcome(status: number | null, attempts: number): 'sent' | 'pending' | 'failed' {
  if (status !== null && status >= 200 && status < 300) return 'sent';
  const retryable = status === null || status === 408 || status === 429 || status >= 500;
  return retryable && attempts < N8N_MAX_ATTEMPTS ? 'pending' : 'failed';
}
export type OutboxEvent = { id: string; event_type: string; reservation_id: string; previous_reservation_id: string | null; payload: unknown; created_at: string; attempts: number };
export function webhookBody(e: OutboxEvent) {
  const r = ((e.payload as { reservation?: Record<string, unknown> })?.reservation ?? {}) as Record<string, unknown>;
  const startsAt = typeof r['startsAt'] === 'string' ? (r['startsAt'] as string) : null;
  const hours = Number(r['hours'] ?? 0);
  const endsAt = startsAt && Number.isFinite(hours) ? new Date(Date.parse(startsAt) + hours * 3600000).toISOString() : null;
  const facilityName = facilities.find(f => f.id === r['facilityId'])?.name ?? null;
  return JSON.stringify({
    eventId: e.id,
    type: e.event_type,
    occurredAt: e.created_at,
    attempt: e.attempts,
    demo: true,
    notice: 'Demo – fiktive Parkdaten, keine Live-Verfügbarkeit, keine echte Zahlung.',
    reservationId: e.reservation_id,
    previousReservationId: e.previous_reservation_id,
    status: r['status'] ?? null,
    facilityName,
    startsAt,
    endsAt,
    ...(e.payload as object),
  });
}
export async function hmacHex(secret: string, message: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}
/** Constant-time comparison; false when either side is missing. */
export function safeEqual(a: string | null | undefined, b: string | null | undefined) {
  if (!a || !b) return false;
  const x = new TextEncoder().encode(a), y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}
export function validWebhookUrl(url: string | undefined): url is string {
  if (!url) return false;
  try { const u = new URL(url); return u.protocol === 'https:'; } catch { return false; }
}
