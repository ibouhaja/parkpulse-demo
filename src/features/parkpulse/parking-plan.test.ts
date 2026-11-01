import { describe, expect, it } from 'vitest';
import { facilities, initialState } from './data';
import { restoreState, transition } from './session';
import { createParkingPlan, parkingLevels, savePlanPosition, selectFreeSpot, simulateOccupancy, matchesSpot, defaultFilters, vehicleDefaults, type ParkingSpot, occupancyStats, protectSessionPosition } from './parking-plan';

const plan = () => createParkingPlan('quartier');
const started = (facilityId = 'quartier') => transition(initialState, { type: 'start', facilityId, id: 'plan-session', now: 1000 });

describe('Fiktive Stellplatzübersicht', () => {
  it('enthält P1, P2 und P3 mit je 48 eindeutigen Stellplätzen für alle sechs Parkhäuser', () => {
    expect(facilities).toHaveLength(6);
    for (const facility of facilities) {
      const spots = createParkingPlan(facility.id);
      expect(spots).toHaveLength(144);
      for (const level of parkingLevels) expect(spots.filter(s => s.level === level)).toHaveLength(48);
      expect(new Set(spots.map(s => `${s.level}/${s.bay}`)).size).toBe(144);
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
    expect(selectFreeSpot(simulateOccupancy(plan(), 1), selected)).toBeNull();
    const state = started();
    expect(savePlanPosition(state, 'quartier', simulateOccupancy(plan(), 1), selected)).toBe(state);
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
    const changed = simulateOccupancy(plan(), 1);
    expect(savePlanPosition(state, 'quartier', changed, { level: 'P1', bay: 'B03' })).toBe(state);
    expect(state.session?.bay).toBe('B03');
  });
});

describe('Fahrzeugkriterien und Kategorien', () => {
  const getSpot = (bay: string, facility = 'quartier'): ParkingSpot => {
    const spot = createParkingPlan(facility).find(s => s.level === 'P1' && s.bay === bay);
    if (!spot) throw new Error('Teststellplatz fehlt');
    return spot;
  };
  it('weist alle sieben Kategorien nur auf geeigneten Geländen aus', () => {
    const all = facilities.flatMap(p => createParkingPlan(p.id));
    expect(new Set(all.map(s => s.category)).size).toBe(7);
    expect(createParkingPlan('quartier').some(s => s.category === 'truck' || s.category === 'van')).toBe(false);
    expect(createParkingPlan('nord').filter(s => s.category === 'truck').every(s => s.level === 'P1' && s.heavySuitable)).toBe(true);
  });
  it('stellt Ladeleistungen 11 kW, 22 kW und 50 kW DC mit passenden Steckern bereit', () => {
    const chargers = createParkingPlan('quartier').filter(s => s.charging).map(s => s.charging);
    expect(chargers).toContainEqual({ power: 11, mode: 'AC', connector: 'Typ 2' });
    expect(chargers).toContainEqual({ power: 22, mode: 'AC', connector: 'Typ 2' });
    expect(chargers).toContainEqual({ power: 50, mode: 'DC', connector: 'CCS' });
    expect(createParkingPlan('stadtgarten').some(s => s.charging)).toBe(false);
  });
  it('prüft jede Maß- und Gewichtsgrenze einschließlich Grenzgleichheit', () => {
    const spot = getSpot('B01');
    const limits = { ...defaultFilters, height: 2.1, length: 5, width: 2.5, weight: 3000 };
    expect(matchesSpot(spot, limits)).toBe(true);
    for (const key of ['height', 'length', 'width', 'weight'] as const) expect(matchesSpot(spot, { ...limits, [key]: limits[key] + 0.01 })).toBe(false);
    expect(matchesSpot(spot, { ...limits, height: 0 })).toBe(false);
    expect(matchesSpot(spot, { ...limits, weight: NaN })).toBe(false);
  });
  it('lässt LKW und Transporter nur auf geeignete große Plätze', () => {
    const truck = { ...defaultFilters, vehicle: 'truck' as const, ...vehicleDefaults.truck };
    const van = { ...defaultFilters, vehicle: 'van' as const, ...vehicleDefaults.van };
    expect(matchesSpot(getSpot('B08', 'nord'), truck)).toBe(true);
    expect(matchesSpot(getSpot('B07', 'nord'), van)).toBe(true);
    expect(matchesSpot(getSpot('B07', 'nord'), truck)).toBe(false);
    expect(matchesSpot(getSpot('B01'), van)).toBe(false);
    expect(matchesSpot(getSpot('B08', 'nord'), defaultFilters)).toBe(false);
  });
  it('filtert Wallbox nach E-Auto und Ladestation', () => {
    const ev = { ...defaultFilters, vehicle: 'ev' as const, ...vehicleDefaults.ev, needs: { ...defaultFilters.needs, wallbox: true } };
    expect(matchesSpot(getSpot('B02'), ev)).toBe(true);
    expect(matchesSpot(getSpot('B01'), ev)).toBe(false);
    expect(matchesSpot(getSpot('B02'), { ...ev, vehicle: 'car' })).toBe(false);
  });
  it('verknüpft Familien-, Frauen- und Zugangsbedürfnisse ohne persönliche Erkennung', () => {
    const family = { ...defaultFilters, needs: { ...defaultFilters.needs, family: true, accessible: true } };
    expect(matchesSpot(getSpot('B03'), family)).toBe(true);
    expect(matchesSpot(getSpot('B01'), family)).toBe(false);
    const women = { ...defaultFilters, needs: { ...defaultFilters.needs, women: true } };
    expect(matchesSpot(getSpot('B04'), women)).toBe(true);
    expect(matchesSpot(getSpot('B03'), women)).toBe(false);
    const access = { ...defaultFilters, needs: { ...defaultFilters.needs, accessible: true } };
    expect(matchesSpot(getSpot('B05'), access)).toBe(true);
    expect(matchesSpot(getSpot('B04'), access)).toBe(false);
    expect(plan().filter(s => matchesSpot(s, { ...family, needs: { ...family.needs, women: true } }))).toHaveLength(0);
  });
  it('sperrt ungeklärte Belegung und löst diese durch Simulation auf', () => {
    const spots = plan().map(s => s.bay === 'B03' ? { ...s, unknown: true, occupied: false } : s);
    expect(selectFreeSpot(spots, { level: 'P1', bay: 'B03' })).toBeNull();
    expect(selectFreeSpot(simulateOccupancy(spots, 0), { level: 'P1', bay: 'B03' })).toEqual({ level: 'P1', bay: 'B03' });
  });
  it('sperrt ungeeignete Auswahl und Speicherung auch nach Filterwechsel', () => {
    const state = started();
    const filters = { ...defaultFilters, vehicle: 'truck' as const, ...vehicleDefaults.truck };
    expect(selectFreeSpot(plan(), { level: 'P1', bay: 'B03' }, filters)).toBeNull();
    expect(savePlanPosition(state, 'quartier', plan(), { level: 'P1', bay: 'B03' }, filters)).toBe(state);
    const saved = savePlanPosition(state, 'quartier', plan(), { level: 'P1', bay: 'B03' }, defaultFilters);
    const restored = restoreState(JSON.stringify(saved));
    expect(restored.session?.bay).toBe('B03');
    expect(restored.session?.level).toBe('P1');
  });
});

describe('Ausgewogene Demo-Belegung', () => {
  it('startet auf jeder Ebene jedes Parkhauses mit 60–70 % frei und 30–40 % belegt', () => {
    for (const facility of facilities) for (const level of parkingLevels) {
      const stats = occupancyStats(createParkingPlan(facility.id).filter(s => s.level === level));
      expect(stats.total).toBe(48);
      expect(stats.free / stats.total).toBeGreaterThanOrEqual(0.6);
      expect(stats.free / stats.total).toBeLessThanOrEqual(0.7);
      expect(stats.occupied / stats.total).toBeGreaterThanOrEqual(0.3);
      expect(stats.occupied / stats.total).toBeLessThanOrEqual(0.4);
      expect(stats.unknown).toBe(0);
      expect(stats.percent).toBe(35);
    }
  });
  it('zeigt konsistente Gesamtsummen und bleibt bei wiederholter Simulation ausgewogen', () => {
    let spots = plan();
    expect(occupancyStats(spots)).toEqual({ total: 144, free: 93, occupied: 51, unknown: 0, percent: 35 });
    for (let step = 0; step < 30; step++) {
      spots = simulateOccupancy(spots, step);
      const stats = occupancyStats(spots);
      expect(stats.free + stats.occupied + stats.unknown).toBe(144);
      expect(stats.free / stats.total).toBeGreaterThanOrEqual(0.6);
      expect(stats.occupied / stats.total).toBeLessThanOrEqual(0.4);
    }
  });
  it('gibt eine gespeicherte Sessionposition bei keiner Simulation wieder frei', () => {
    const state = savePlanPosition(started(), 'quartier', plan(), { level: 'P1', bay: 'B03' });
    const restored = restoreState(JSON.stringify(state));
    expect(restored.session?.bay).toBe('B03');
    for (let step = 0; step < 30; step++) {
      const protectedSpots = protectSessionPosition(simulateOccupancy(plan(), step), restored.session);
      const spot = protectedSpots.find(s => s.level === 'P1' && s.bay === 'B03');
      expect(spot?.occupied).toBe(true);
      expect(spot?.unknown).toBe(false);
      expect(selectFreeSpot(protectedSpots, { level: 'P1', bay: 'B03' })).toBeNull();
    }
    expect(protectSessionPosition(plan(), null)).toEqual(plan());
  });
  it('schützt auch ausstehende Abschlüsse und normalisiert frühere Stellplatznummern', () => {
    const saved = transition(started(), { type: 'location', level: 'P1', bay: 'B3' });
    const pending = transition(saved, { type: 'end', now: 5000 });
    const spots = protectSessionPosition(plan(), restoreState(JSON.stringify(pending)).session);
    expect(spots.find(s => s.level === 'P1' && s.bay === 'B03')?.occupied).toBe(true);
    expect(pending.session?.finalFee).toBe(2);
    expect(pending.stamps).toBe(5);
  });
});
