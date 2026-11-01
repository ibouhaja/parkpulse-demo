import { describe, expect, it } from 'vitest';
import { facilities, initialState } from './data';
import { restoreState, transition } from './session';

const facility = facilities[0]!;
const started = () => transition(initialState, { type: 'start', facilityId: facility.id, id: 's1', now: 1_000_000 });

describe('Parkposition speichern', () => {
  it('lehnt leere Felder ab', () => {
    const next = transition(started(), { type: 'location', level: '', bay: '' });
    expect(next.session?.level).toBe('');
    expect(next.session?.bay).toBe('');
  });

  it('lehnt teilweise ausgefüllte Felder ab (nur Ebene)', () => {
    const next = transition(started(), { type: 'location', level: 'P2', bay: '' });
    expect(next.session?.level).toBe('');
    expect(next.session?.bay).toBe('');
  });

  it('lehnt teilweise ausgefüllte Felder ab (nur Stellplatz)', () => {
    const next = transition(started(), { type: 'location', level: '', bay: 'B14' });
    expect(next.session?.level).toBe('');
    expect(next.session?.bay).toBe('');
  });

  it('lehnt Felder ab, die nur Leerzeichen enthalten', () => {
    const next = transition(started(), { type: 'location', level: '   ', bay: '  ' });
    expect(next.session?.level).toBe('');
    expect(next.session?.bay).toBe('');
  });

  it('speichert gültige Werte wie P2 und B14 und entfernt Leerzeichen', () => {
    const next = transition(started(), { type: 'location', level: ' P2 ', bay: ' B14 ' });
    expect(next.session?.level).toBe('P2');
    expect(next.session?.bay).toBe('B14');
  });

  it('überschreibt eine gespeicherte Position nicht mit leeren Werten', () => {
    const withPos = transition(started(), { type: 'location', level: 'P2', bay: 'B14' });
    const next = transition(withPos, { type: 'location', level: '', bay: '' });
    expect(next.session?.level).toBe('P2');
    expect(next.session?.bay).toBe('B14');
  });

  it('bleibt nach einem Neuladen (Speicherung und Wiederherstellung) erhalten', () => {
    const withPos = transition(started(), { type: 'location', level: 'P2', bay: 'B14' });
    const restored = restoreState(JSON.stringify(withPos));
    expect(restored.session?.level).toBe('P2');
    expect(restored.session?.bay).toBe('B14');
  });

  it('bleibt im ausstehenden Abschluss nach Neuladen erhalten und landet im Verlauf', () => {
    let state = transition(started(), { type: 'location', level: 'P2', bay: 'B14' });
    state = transition(state, { type: 'advance', hours: 1, now: 2_000_000 });
    state = transition(state, { type: 'end', now: 2_000_000 });
    const restored = restoreState(JSON.stringify(state));
    expect(restored.session?.status).toBe('checkout-pending');
    expect(restored.session?.level).toBe('P2');
    expect(restored.session?.bay).toBe('B14');
    const done = transition(restored, { type: 'complete', sessionId: 's1', payment: 'success', method: 'paypal', now: 3_000_000 });
    expect(done.history[0]?.level).toBe('P2');
    expect(done.history[0]?.bay).toBe('B14');
    expect(done.receipts[0]?.level).toBe('P2');
    expect(done.receipts[0]?.bay).toBe('B14');
  });
});
