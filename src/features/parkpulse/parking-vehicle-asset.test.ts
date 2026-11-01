import { describe, expect, it } from 'vitest';
import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
import { disposeVehicle, prepareVehicle } from './parking-vehicle-asset';

describe('Fahrzeugmaterialien', () => {
  it('trennt Lack, Glas und Reifen und verändert das geladene Original nicht', () => {
    const source = new Group();
    for (const name of ['bodypaint', 'glass', 'rubber']) {
      const material = new MeshStandardMaterial({ name });
      source.add(new Mesh(new BoxGeometry(1, 1, 2), material));
    }
    const original = (source.children[0] as Mesh).geometry.attributes.position?.array.slice();
    const parts = prepareVehicle(source, 'sedan');
    expect(parts).toHaveLength(3);
    expect(parts.filter(p => p.paint).map(p => p.material.name)).toEqual(['bodypaint']);
    expect(parts.find(p => p.material.name === 'glass')?.paint).toBe(false);
    expect(parts.find(p => p.material.name === 'rubber')?.paint).toBe(false);
    expect((source.children[0] as Mesh).geometry.attributes.position?.array).toEqual(original);
    disposeVehicle(parts);
  });
});