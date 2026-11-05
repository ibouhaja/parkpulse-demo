import { describe, it, expect } from 'vitest';
import { deliveryOutcome, retryDelayMs, safeEqual, hmacHex, webhookBody, validWebhookUrl, N8N_MAX_ATTEMPTS } from './n8n-rules';

describe('n8n Demo-Integration', () => {
  it('2xx gilt als zugestellt', () => {
    expect(deliveryOutcome(200, 1)).toBe('sent');
    expect(deliveryOutcome(204, 3)).toBe('sent');
  });
  it('Netzwerkfehler, 429 und 5xx werden erneut versucht, bis maximal 8 Versuche', () => {
    expect(deliveryOutcome(null, 1)).toBe('pending');
    expect(deliveryOutcome(429, 2)).toBe('pending');
    expect(deliveryOutcome(503, N8N_MAX_ATTEMPTS - 1)).toBe('pending');
    expect(deliveryOutcome(503, N8N_MAX_ATTEMPTS)).toBe('failed');
  });
  it('falsche URL oder Zugangsdaten (4xx) werden nicht endlos wiederholt', () => {
    expect(deliveryOutcome(401, 1)).toBe('failed');
    expect(deliveryOutcome(404, 1)).toBe('failed');
  });
  it('Backoff 1, 2, 4 … Minuten, höchstens 60 Minuten', () => {
    expect(retryDelayMs(1)).toBe(60000);
    expect(retryDelayMs(3)).toBe(240000);
    expect(retryDelayMs(20)).toBe(3600000);
  });
  it('Schlüsselvergleich verlangt exakte Übereinstimmung', () => {
    expect(safeEqual('abc', 'abc')).toBe(true);
    expect(safeEqual('abc', 'abd')).toBe(false);
    expect(safeEqual('abc', 'abcd')).toBe(false);
    expect(safeEqual(null, 'abc')).toBe(false);
    expect(safeEqual('', '')).toBe(false);
  });
  it('HMAC-SHA256 entspricht dem Standard-Testvektor', async () => {
    expect(await hmacHex('key', 'The quick brown fox jumps over the lazy dog')).toBe('f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8');
  });
  it('Webhook enthält eindeutige Event-ID und Demo-Kennzeichnung', () => {
    const body = JSON.parse(webhookBody({ id: 'e1', event_type: 'reservation.cancelled', reservation_id: 'r1', previous_reservation_id: null, payload: { reservation: { status: 'cancelled' } }, created_at: '2026-11-02T10:00:00Z', attempts: 1 }));
    expect(body.eventId).toBe('e1');
    expect(body.type).toBe('reservation.cancelled');
    expect(body.demo).toBe(true);
    expect(body.reservation.status).toBe('cancelled');
  });
  it('Webhook enthält Status, Garagenname, Start- und Endzeit', () => {
    const body = JSON.parse(webhookBody({
      id: 'e2', event_type: 'reservation.confirmed', reservation_id: 'r2', previous_reservation_id: null,
      payload: { reservation: { status: 'confirmed', facilityId: 'quartier', startsAt: '2026-11-10T08:00:00.000Z', hours: 2.5 } },
      created_at: '2026-11-02T10:00:00Z', attempts: 1,
    }));
    expect(body.status).toBe('confirmed');
    expect(body.facilityName).toBe('Parkhaus am Quartier');
    expect(body.startsAt).toBe('2026-11-10T08:00:00.000Z');
    expect(body.endsAt).toBe('2026-11-10T10:30:00.000Z');
  });
  it('Webhook ohne Reservierungsdaten liefert null-Felder', () => {
    const body = JSON.parse(webhookBody({ id: 'e3', event_type: 'reservation.no_show', reservation_id: 'r3', previous_reservation_id: null, payload: {}, created_at: '2026-11-02T10:00:00Z', attempts: 1 }));
    expect(body.status).toBeNull();
    expect(body.facilityName).toBeNull();
    expect(body.endsAt).toBeNull();
  });
  it('nur HTTPS-Webhook-URLs', () => {
    expect(validWebhookUrl('https://n8n.example.com/webhook/x')).toBe(true);
    expect(validWebhookUrl('http://n8n.example.com/webhook/x')).toBe(false);
    expect(validWebhookUrl(undefined)).toBe(false);
  });
});
