import { initialState, type DemoState } from './data';
import { transition, type Action } from './session';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const sampleIds = new Set(initialState.history.map((h) => h.id));

/**
 * Rebuilds a client-sent action from scratch. Timestamps always come from the server,
 * unknown fields are dropped and malformed actions are rejected.
 */
export function sanitizeAction(input: unknown, now: number, fallbackId: string): Action | null {
  if (!input || typeof input !== 'object') return null;
  const a = input as { type?: unknown; facilityId?: unknown; id?: unknown; hours?: unknown; level?: unknown; bay?: unknown; sessionId?: unknown; discount?: unknown; voucherId?: unknown; payment?: unknown; method?: unknown };
  switch (a.type) {
    case 'start':
      return typeof a.facilityId === 'string'
        ? { type: 'start', facilityId: a.facilityId, id: typeof a.id === 'string' && UUID.test(a.id) ? a.id : fallbackId, now }
        : null;
    case 'advance':
      return a.hours === 1 || a.hours === 3 ? { type: 'advance', hours: a.hours, now } : null;
    case 'location':
      return typeof a.level === 'string' && typeof a.bay === 'string'
        ? { type: 'location', level: a.level.slice(0, 20), bay: a.bay.slice(0, 20), sessionId: typeof a.sessionId === 'string' ? a.sessionId : undefined }
        : null;
    case 'end':
      return { type: 'end', now };
    case 'discount':
      return a.discount === 'none' || a.discount === 'SHOP2' || a.discount === 'voucher'
        ? { type: 'discount', discount: a.discount, voucherId: typeof a.voucherId === 'string' ? a.voucherId : undefined }
        : null;
    case 'complete':
      if (typeof a.sessionId !== 'string' || !(a.payment === 'success' || a.payment === 'failure' || a.payment === 'free')) return null;
      return { type: 'complete', sessionId: a.sessionId, payment: a.payment, method: a.method === 'paypal' ? 'paypal' : 'card', now };
    default:
      return null;
  }
}

export function applyServerAction(state: DemoState, input: unknown, now: number, fallbackId: string) {
  const action = sanitizeAction(input, now, fallbackId);
  if (!action) return { state, changed: false };
  const next = transition(state, action);
  return { state: next, changed: next !== state };
}

/** An account may adopt browser data only once, and only while it is still untouched. */
export function canImport(state: DemoState, decision: string | null) {
  return decision === null && state.session === null && state.receipts.length === 0 && state.history.every((h) => sampleIds.has(h.id));
}
