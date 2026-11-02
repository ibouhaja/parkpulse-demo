import { describe, it, expect } from 'vitest';
import { batchTotalCents, validBatchConfirmation, validRescheduleConfirmation, cancellationPercent, cancellationFeeCents, noShowDue, validCancellationConfirmation } from './cancellation-rules';
import type { Reservation } from './reservation-rules';
const start = Date.parse('2026-11-02T10:00:00Z');
const r: Reservation = { id: 'r', facility_id:'quartier', level:'P1', bay:'B02', starts_at:new Date(start).toISOString(), hours:2, price:9.99, status:'booked', session_id:null };
describe('Stornierung und No-Show', () => {
  it.each([[180*60000,0],[120*60000+1,0],[120*60000,50],[90*60000,50],[60*60000,50],[60*60000-1,100],[0,100],[-1,100]])('Zeitgrenze %s ms ergibt %s Prozent', (remaining, percent) => {
    expect(cancellationPercent(r.starts_at, start-remaining)).toBe(percent);
  });
  it.each([[0,0],[50,500],[100,999]])('9,99 Euro vor Rabatten bei %s Prozent ergibt %s Cent', (percent,cents) => {
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
    const q={id:'q',reservationId:'r',price:9.99,percent:50,feeCents:500,expiresAt:start};
    expect(validCancellationConfirmation(q,undefined,start)).toBe(false);
    expect(validCancellationConfirmation(q,'other',start)).toBe(false);
    expect(validCancellationConfirmation(q,'q',start)).toBe(true);
    expect(validCancellationConfirmation(q,'q',start+1)).toBe(false);
    expect(validCancellationConfirmation({...q,feeCents:0},'q',start)).toBe(false);
  });
  const item=(id:string,price:number,percent:number)=>({id,reservationId:'r'+id,facilityId:'quartier',level:'P1',bay:'B01',startsAt:r.starts_at,hours:2,price,percent,feeCents:Math.round(Math.round(price*100)*percent/100)});
  it('Sammelstornierung summiert Gebühren je Reservierung', () => {
    const items=[item('a',9.99,0),item('b',9.99,50),item('c',4,100)];
    expect(batchTotalCents(items)).toBe(0+500+400);
    const q={batchId:'b1',items,totalFeeCents:900,expiresAt:start};
    expect(validBatchConfirmation(q,'b1',start)).toBe(true);
    expect(validBatchConfirmation(q,'b1',start+1)).toBe(false);
    expect(validBatchConfirmation(q,undefined,start)).toBe(false);
    expect(validBatchConfirmation({...q,totalFeeCents:0},'b1',start)).toBe(false);
    expect(validBatchConfirmation({...q,items:[]},'b1',start)).toBe(false);
  });
  it('Verschieben braucht genau eine passende Stornovorschau und eigene Bestätigung', () => {
    const cancellation={batchId:'b1',items:[item('a',9.99,50)],totalFeeCents:500,expiresAt:start};
    const o={id:'n',reservationId:'ra',cancellation,facility:'quartier',level:'P1',bay:'B01',startsAt:r.starts_at,hours:2,price:9.99,expiresAt:start};
    expect(validRescheduleConfirmation(o,'n',start)).toBe(true);
    expect(validRescheduleConfirmation(o,'b1',start)).toBe(false);
    expect(validRescheduleConfirmation({...o,reservationId:'other'},'n',start)).toBe(false);
  });
});
