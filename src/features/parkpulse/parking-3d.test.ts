import { describe, it, expect } from 'vitest';
import { createParkingPlan, defaultFilters, parkingLevels, selectFreeSpot, savePlanPosition, protectSessionPosition, simulateOccupancy } from './parking-plan';
import { demoModels, filtersForModel, parkingPose, sceneSpots, spotCoordinates } from './parking-3d-rules';
import { initialState } from './data';
import { transition, restoreState } from './session';

describe('3D-P1', () => {
  it('zeigt dieselben gefilterten Belegungen ohne Änderungen der Quelle', () => {
    const source = createParkingPlan('quartier'); const before = JSON.stringify(source);
    const spots = sceneSpots(source, 'P1', defaultFilters);
    expect(spots.length).toBeGreaterThan(20); expect(spots.some(s => s.occupied)).toBe(true); expect(spots.some(s => !s.occupied)).toBe(true);
    expect(JSON.stringify(source)).toBe(before);
    for (const spot of spots) expect(selectFreeSpot(source, spot, defaultFilters) !== null).toBe(!spot.occupied && !spot.unknown);
  });
  it('legt alle 48 Plätze getrennt und das Fahrzeug am Animationsende exakt im Platz ab', () => {
    const coords = Array.from({ length: 48 }, (_, n) => spotCoordinates(`B${n + 1}`));
    expect(new Set(coords.map(p => `${p.x},${p.z}`)).size).toBe(48);
    expect(spotCoordinates('B01')).toEqual({ x: -20.35, z: -12, yaw: Math.PI });
    expect(spotCoordinates('B48')).toEqual({ x: 20.35, z: 12, yaw: 0 });
    expect(parkingPose('B14', 1)).toEqual(spotCoordinates('B14'));
    expect(parkingPose('B14', 0)).not.toEqual(parkingPose('B14', 1));
  });
  it('wendet reale Demo-Modellgrenzen an und erhält Bedürfnisse', () => {
    const f = { ...defaultFilters, needs: { ...defaultFilters.needs, wallbox: true } };
    expect(filtersForModel(f, 'van')).toMatchObject({ vehicle: 'van', height: 2.6, length: 6, width: 2.1, weight: 3500, needs: { wallbox: true } });
    for (const model of demoModels) expect(filtersForModel(f, model).length).toBeGreaterThan(0);
  });
});

describe('3D-Ebenen und Sessionsynchronisierung', () => {
  for (const level of parkingLevels) {
    it(`${level}: Wallbox-Kombinationen zeigen tatsächliche Belegungen und sperren belegte Plätze`, () => {
      const source = createParkingPlan('quartier');
      for (const need of ['family', 'women', 'accessible'] as const) {
        const filters = { ...defaultFilters, needs: { ...defaultFilters.needs, wallbox: true, [need]: true } };
        const spots = sceneSpots(source, level, filters);
        expect(spots.length).toBeGreaterThanOrEqual(2);
        for (const spot of spots) { expect(spot.charging?.power).toBeGreaterThan(0); expect(selectFreeSpot(source, spot, filters) !== null).toBe(!spot.occupied && !spot.unknown); }
      }
    });
    it(`${level}: 3D-Auswahl speichert dieselbe Position und schützt sie nach Neuladen und Simulation`, () => {
      const source = createParkingPlan('quartier'); const spot = sceneSpots(source, level, defaultFilters).find(s => !s.occupied && !s.unknown);
      if (!spot) throw new Error('Freier Demo-Platz fehlt');
      const active = transition(initialState, { type: 'start', facilityId: 'quartier', now: 1000, id: '3d-session' });
      const saved = savePlanPosition(active, 'quartier', source, spot, defaultFilters);
      const restored = restoreState(JSON.stringify(saved));
      expect(restored.session).toMatchObject({ level, bay: spot.bay });
      expect(restored.stamps).toBe(initialState.stamps);
      const simulated = protectSessionPosition(simulateOccupancy(source, 7), restored.session);
      expect(sceneSpots(simulated, level, defaultFilters).find(s => s.bay === spot.bay)?.occupied).toBe(true);
      expect(selectFreeSpot(simulated, spot, defaultFilters)).toBeNull();
    });
  }
});