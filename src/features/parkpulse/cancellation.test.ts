import { describe, it, expect } from 'vitest';
import { cancellationPercent, cancellationFeeCents, noShowDue, validCancellationConfirmation } from './cancellation-rules';
import type { Reservation } from './reservation-rules';
const start = Date.parse('2026-11-02T10:00:00Z');
const r: Reservation = { id: 'r', facility_id:'quartier', level:'P1', bay:'B02', starts_at:new Date(start).toISOString(), hours:2, price:9.99, status:'booked', session_id:null };
describe('Stornierung und No-Show', () => {
  it.each([[180*60000+1,0],[180*60000,25],[120*60000,25],[120*60000-1,50],[60*60000,50],[60*60000-1,100],[0,100],[-1,100]])('Zeitgrenze %s ms ergibt %s Prozent', (remaining, percent) => {
    expect(cancellationPercent(r.starts_at, start-remaining)).toBe(percent);
  });
  it.each([[0,0],[25,250],[50,500],[100,999]])('9,99 Euro vor Rabatten bei %s Prozent ergibt %s Cent', (percent,cents) => {
    expect(cancellationFeeCents(9.99,percent)).toBe(cents);
  });
  it('No-Show exakt nach 15 Minuten, nicht vorher oder nach Check-in', () => {
    expect(noShowDue(r,start+15*60000-1)).toBe(false);
    expect(noShowDue(r,start+15*60000)).toBe(true);
    expect(noShowDue({...r,status:'arrived'},start+16*60000)).toBe(false);
    expect(cancellationFeeCents(r.price,100)).toBe(999);
  });
  it('terminale Zustände werden nach Neuladen nicht erneut belastet', () => {
    for(const status of ['cancelled','completed','no_show'] as const){
      const saved=JSON.parse(JSON.stringify({...r,reservation_status:status,fee_cents:999}));
      expect(noShowDue(saved,start+86400000)).toBe(false);
      expect(saved.fee_cents).toBe(999);
    }
  });
  it('Stornierung benötigt eine passende, unexpired ausdrückliche Bestätigung', () => {
    const q={id:'q',reservationId:'r',price:9.99,percent:25,feeCents:250,expiresAt:start};
    expect(validCancellationConfirmation(q,undefined,start)).toBe(false);
    expect(validCancellationConfirmation(q,'other',start)).toBe(false);
    expect(validCancellationConfirmation(q,'q',start)).toBe(true);
    expect(validCancellationConfirmation(q,'q',start+1)).toBe(false);
    expect(validCancellationConfirmation({...q,feeCents:0},'q',start)).toBe(false);
  });
});