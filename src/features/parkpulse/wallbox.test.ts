import { describe, expect, it } from 'vitest';
import { facilities, initialState } from './data';
import { createParkingPlan, defaultFilters, matchesSpot, parkingLevels, savePlanPosition, selectFreeSpot, type Needs } from './parking-plan';
import { restoreState, transition } from './session';

describe('Wallbox-Filter auf allen Demo-Ebenen', () => {
  for (const facility of facilities) for (const level of parkingLevels) {
    it(`${facility.id} ${level}: mindestens zwei Ladeplätze und ein freier Platz auch mit PKW-Vorgabe`, () => {
      const spots = createParkingPlan(facility.id);
      const snapshot = JSON.stringify(spots);
      const filters = { ...defaultFilters, needs: { ...defaultFilters.needs, wallbox: true } };
      const matching = spots.filter(s => s.level === level && matchesSpot(s, filters));
      expect(matching.length).toBeGreaterThanOrEqual(2);
      expect(matching.some(s => !s.occupied && !s.unknown)).toBe(true);
      expect(matching.every(s => s.charging && s.charging.power > 0)).toBe(true);
      expect(JSON.stringify(spots)).toBe(snapshot);
      for (const spot of matching) expect(!!selectFreeSpot(spots, spot, filters)).toBe(!spot.occupied && !spot.unknown);
    });
  }
  for (const level of parkingLevels) for (const need of ['family', 'women', 'accessible'] as (keyof Needs)[]) {
    it(`${level}: Wallbox kombiniert mit ${need}`, () => {
      const spots = createParkingPlan('quartier');
      const filters = { ...defaultFilters, needs: { ...defaultFilters.needs, wallbox: true, [need]: true } };
      const matching = spots.filter(s => s.level === level && matchesSpot(s, filters));
      expect(matching.length).toBeGreaterThanOrEqual(2);
      expect(matching.every(s => s.charging)).toBe(true);
      expect(matching.every(s => need === 'accessible' ? s.accessible : s.category === need)).toBe(true);
    });
  }
  it('bewahrt echte Demo-Zustände, auch ungeklärte, statt alle Treffer frei zu setzen', () => {
    const spots = createParkingPlan('quartier').map(s => s.bay === 'B02' ? { ...s, unknown: true } : s);
    const filters = { ...defaultFilters, needs: { ...defaultFilters.needs, wallbox: true } };
    const matching = spots.filter(s => matchesSpot(s, filters));
    expect(matching.some(s => s.unknown)).toBe(true);
    expect(matching.some(s => s.occupied && !s.unknown)).toBe(true);
    expect(matching.some(s => !s.occupied && !s.unknown)).toBe(true);
    expect(selectFreeSpot(spots, { level: 'P3', bay: 'B02' }, filters)).toBeNull();
  });
  it('speichert einen freien P3-Ladeplatz und erhält die Sessionposition nach Neuladen', () => {
    const spots = createParkingPlan('quartier');
    const filters = { ...defaultFilters, needs: { ...defaultFilters.needs, wallbox: true } };
    const free = spots.find(s => s.level === 'P3' && matchesSpot(s, filters) && !s.occupied && !s.unknown);
    if (!free) throw new Error('Freier P3-Ladeplatz fehlt');
    const state = transition(initialState, { type: 'start', facilityId: 'quartier', id: 'wallbox-session', now: 1000 });
    const saved = restoreState(JSON.stringify(savePlanPosition(state, 'quartier', spots, free, filters)));
    expect(saved.session?.level).toBe('P3');
    expect(saved.session?.bay).toBe(free.bay);
    expect(saved.stamps).toBe(5);
  });
  it('liefert bei unvereinbaren Bedürfnissen keine Treffer und nach Zurücksetzen wieder Plätze', () => {
    const spots = createParkingPlan('quartier');
    const filters = { ...defaultFilters, needs: { ...defaultFilters.needs, wallbox: true, family: true, women: true } };
    expect(spots.filter(s => matchesSpot(s, filters))).toHaveLength(0);
    expect(spots.filter(s => matchesSpot(s, defaultFilters)).length).toBeGreaterThan(0);
  });
});