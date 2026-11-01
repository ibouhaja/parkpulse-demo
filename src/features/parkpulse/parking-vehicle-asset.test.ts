import { describe, expect, it } from 'vitest';
import { BoxGeometry, BufferGeometry, Int16BufferAttribute, Group, Mesh, MeshStandardMaterial } from 'three';
import { disposeVehicle, prepareVehicle } from './parking-vehicle-asset';

describe('Fahrzeugmaterialien', () => {
  it('normalisiert quantisierte GLB-Koordinaten vor der Transformation', () => {
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Int16BufferAttribute([-32767, 0, -32767, 32767, 0, -32767, 0, 32767, 32767], 3, true));
    geometry.computeVertexNormals();
    const source = new Group(); source.add(new Mesh(geometry, new MeshStandardMaterial({ name: 'paintC' })));
    const parts = prepareVehicle(source, 'compact');
    expect(parts[0]?.geometry.getAttribute('position').array).toBeInstanceOf(Float32Array);
    parts[0]?.geometry.computeBoundingBox();
    expect(parts[0]?.geometry.boundingBox?.max.z).toBeCloseTo(1.9);
    expect(parts[0]?.paint).toBe(true);
    expect(geometry.getAttribute('position').normalized).toBe(true);
    disposeVehicle(parts);
  });
  it('trennt Lack, Glas und Reifen und verändert das geladene Original nicht', () => {
    const source = new Group();
    for (const name of ['bodypaint', 'glass', 'rubber']) {
      const material = new MeshStandardMaterial({ name });
      source.add(new Mesh(new BoxGeometry(1, 1, 2), material));
    }
    const bodyDetail = new BoxGeometry(.2, .2, .2);
    bodyDetail.deleteAttribute('uv');
    source.add(new Mesh(bodyDetail, (source.children[0] as Mesh).material));
    const original = (source.children[0] as Mesh).geometry.attributes['position']?.array.slice();
    const parts = prepareVehicle(source, 'sedan');
    expect(parts).toHaveLength(3);
    expect(parts.filter(p => p.paint).map(p => p.material.name)).toEqual(['bodypaint']);
    expect(parts.find(p => p.material.name === 'glass')?.paint).toBe(false);
    expect(parts.find(p => p.material.name === 'rubber')?.paint).toBe(false);
    expect((source.children[0] as Mesh).geometry.attributes['position']?.array).toEqual(original);
    disposeVehicle(parts);
  });
});