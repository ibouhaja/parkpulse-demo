import { describe, expect, it } from 'vitest';
import { initialState, type DemoState } from './data';
import { applyServerAction, canImport, sanitizeAction } from './account-rules';
import { transition } from './session';
import { safeRedirect } from '../../routes/auth';

const ID = '11111111-2222-4333-8444-555555555555';
const run = (s: DemoState, a: unknown, now = 1_000_000) => applyServerAction(s, a, now, ID).state;

function pending(): DemoState {
  let s = run(initialState, { type: 'start', facilityId: 'quartier', id: ID }, 0);
  s = run(s, { type: 'advance', hours: 3 }, 1);
  return run(s, { type: 'end' }, 2);
}

describe('server-side action rules', () => {
  it('uses server time, never client-sent timestamps', () => {
    const a = sanitizeAction({ type: 'end', now: 99999999999 }, 42, ID);
    expect(a).toEqual({ type: 'end', now: 42 });
  });
  it('rejects malformed or unknown actions', () => {
    expect(sanitizeAction({ type: 'advance', hours: 100 }, 1, ID)).toBeNull();
    expect(sanitizeAction({ type: 'setStamps', stamps: 5 }, 1, ID)).toBeNull();
    expect(sanitizeAction(null, 1, ID)).toBeNull();
  });
  it('replaces a non-UUID session id with a server id', () => {
    const a = sanitizeAction({ type: 'start', facilityId: 'ufer', id: 'x' }, 1, ID);
    expect(a && a.type === 'start' && a.id).toBe(ID);
  });
  it('still allows only one active session through the server path', () => {
    const s = run(initialState, { type: 'start', facilityId: 'quartier' });
    const r = applyServerAction(s, { type: 'start', facilityId: 'ufer' }, 2, '99999999-2222-4333-8444-555555555555');
    expect(r.changed).toBe(false);
  });
  it('records a simulated PayPal payment on the receipt and awards a stamp', () => {
    const s = run(pending(), { type: 'complete', sessionId: ID, payment: 'success', method: 'paypal' });
    expect(s.receipts[0]?.method).toBe('paypal');
    expect(s.receipts[0]?.payable).toBe(8); // 3 h plus a moment = 4 started hours × 2 €
    expect(s.stamps).toBe(0); // 5 + 1 = 6th stamp -> voucher issued, counter reset
    expect(s.vouchers).toHaveLength(1);
  });
  it('a failed simulated PayPal payment consumes nothing', () => {
    let s = pending();
    s = run(s, { type: 'discount', discount: 'SHOP2' });
    const r = applyServerAction(s, { type: 'complete', sessionId: ID, payment: 'failure', method: 'paypal' }, 3, ID);
    expect(r.changed).toBe(false);
    expect(r.state.shop2Used).toBe(false);
    expect(r.state.receipts).toHaveLength(0);
  });
  it('repeated completion is idempotent on the server', () => {
    const once = run(pending(), { type: 'complete', sessionId: ID, payment: 'success' });
    const r = applyServerAction(once, { type: 'complete', sessionId: ID, payment: 'success' }, 4, ID);
    expect(r.changed).toBe(false);
    expect(r.state.receipts).toHaveLength(1);
  });
});

describe('localStorage import into an account', () => {
  it('is offered for a fresh account', () => expect(canImport(initialState, null)).toBe(true));
  it('is refused after an earlier decision', () => {
    expect(canImport(initialState, 'imported')).toBe(false);
    expect(canImport(initialState, 'declined')).toBe(false);
  });
  it('is refused once the account has its own session or receipts', () => {
    expect(canImport(transition(initialState, { type: 'start', facilityId: 'quartier', id: ID, now: 1 }), null)).toBe(false);
    expect(canImport(run(pending(), { type: 'complete', sessionId: ID, payment: 'success' }), null)).toBe(false);
  });
});

describe('sign-in redirect', () => {
  it('only allows same-origin paths', () => {
    expect(safeRedirect('/checkout')).toBe('/checkout');
    expect(safeRedirect('//evil.example')).toBe('/parksession');
    expect(safeRedirect('https://evil.example')).toBe('/parksession');
    expect(safeRedirect(undefined)).toBe('/parksession');
  });
});
