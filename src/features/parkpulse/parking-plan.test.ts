import { describe, expect, it } from 'vitest';
import { facilities, initialState } from './data';
import { restoreState, transition } from './session';
import { createParkingPlan, parkingLevels, savePlanPosition, selectFreeSpot, simulateOccupancy } from './parking-plan';

const plan = () => createParkingPlan('quartier');
const started = (facilityId = 'quartier') => transition(initialState, { type: 'start', facilityId, id: 'plan-session', now: 1000 });

describe('Fiktive Stellplatzübersicht', () => {
  it('enthält P1, P2 und P3 mit je 24 eindeutigen Stellplätzen für alle sechs Parkhäuser', () => {
    expect(facilities).toHaveLength(6);
    for (const facility of facilities) {
      const spots = createParkingPlan(facility.id);
      expect(spots).toHaveLength(72);
      for (const level of parkingLevels) expect(spots.filter(s => s.level === level)).toHaveLength(24);
      expect(new Set(spots.map(s => `${s.level}/${s.bay}`)).size).toBe(72);
    }
  });
  it('ändert Belegungen in beide Richtungen ohne den Ausgangsplan zu verändern', () => {
    const before = plan();
    const snapshot = JSON.stringify(before);
    const after = simulateOccupancy(before, 0);
    expect(after.some((s, i) => s.occupied && !before[i]?.occupied)).toBe(true);
    expect(after.some((s, i) => !s.occupied && before[i]?.occupied)).toBe(true);
    expect(JSON.stringify(before)).toBe(snapshot);
    expect(after.map(s => [s.level, s.bay])).toEqual(before.map(s => [s.level, s.bay]));
  });
  it('erlaubt die Auswahl eines freien nummerierten Platzes', () => {
    expect(selectFreeSpot(plan(), { level: 'P1', bay: 'B03' })).toEqual({ level: 'P1', bay: 'B03' });
  });
  it('verhindert belegte und unbekannte Stellplätze', () => {
    expect(selectFreeSpot(plan(), { level: 'P1', bay: 'B01' })).toBeNull();
    expect(selectFreeSpot(plan(), { level: 'P1', bay: 'B99' })).toBeNull();
  });
  it('macht eine Auswahl ungültig, sobald der Platz simuliert belegt wird', () => {
    const selected = { level: 'P1' as const, bay: 'B03' };
    expect(selectFreeSpot(plan(), selected)).toEqual(selected);
    expect(selectFreeSpot(simulateOccupancy(plan(), 2), selected)).toBeNull();
    const state = started();
    expect(savePlanPosition(state, 'quartier', simulateOccupancy(plan(), 2), selected)).toBe(state);
  });
  it('speichert Ebene und Nummer in der aktiven Session und erhält sie nach Wiederherstellung', () => {
    const state = savePlanPosition(started(), 'quartier', plan(), { level: 'P1', bay: 'B03' });
    expect(state.session?.level).toBe('P1');
    expect(state.session?.bay).toBe('B03');
    const restored = restoreState(JSON.stringify(state));
    expect(restored.session?.level).toBe('P1');
    expect(restored.session?.bay).toBe('B03');
    expect(restored.stamps).toBe(5);
    expect(restored.vouchers).toEqual([]);
    expect(restored.history).toEqual(initialState.history);
  });
  it('speichert nicht in fremde Parkhäuser, fehlende Sessions oder eingefrorene Abschlüsse', () => {
    const other = started('ufer');
    expect(savePlanPosition(other, 'quartier', plan(), { level: 'P1', bay: 'B03' })).toBe(other);
    expect(savePlanPosition(initialState, 'quartier', plan(), { level: 'P1', bay: 'B03' })).toBe(initialState);
    const ended = transition(started(), { type: 'end', now: 5000 });
    expect(savePlanPosition(ended, 'quartier', plan(), { level: 'P1', bay: 'B03' })).toBe(ended);
  });
  it('überschreibt eine gespeicherte Parkposition nicht durch Belegungswechsel', () => {
    const state = savePlanPosition(started(), 'quartier', plan(), { level: 'P1', bay: 'B03' });
    const changed = simulateOccupancy(plan(), 2);
    expect(savePlanPosition(state, 'quartier', changed, { level: 'P1', bay: 'B03' })).toBe(state);
    expect(state.session?.bay).toBe('B03');
  });
});