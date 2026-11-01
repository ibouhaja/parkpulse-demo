import { Box3, BufferGeometry, DoubleSide, Matrix4, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D, Vector3 } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { DemoModel } from './parking-3d-rules';

export type VehiclePart = { geometry: BufferGeometry; material: MeshStandardMaterial; paint: boolean };

// Keep materials separate: tint only painted bodywork, never tires, glazing or lamps.
export function prepareVehicle(source: Object3D, model: DemoModel): VehiclePart[] {
  const scene = source.clone(true);
  scene.updateMatrixWorld(true);
  const box = new Box3().setFromObject(scene);
  const size = box.getSize(new Vector3()); const center = box.getCenter(new Vector3());
  const scale = (model === 'van' ? 5.6 : model === 'compact' ? 3.8 : model === 'suv' ? 4.7 : 4.5) / Math.max(size.z, .01);
  const normalize = new Matrix4().makeScale(scale, scale, scale).multiply(new Matrix4().makeTranslation(-center.x, -box.min.y, -center.z));
  const buckets = new Map<string, { parts: BufferGeometry[]; material: MeshStandardMaterial; paint: boolean }>();
  scene.traverse(node => {
    if (!(node instanceof Mesh)) return;
    const originals = Array.isArray(node.material) ? node.material : [node.material];
    for (let i = 0; i < originals.length; i++) {
      const original = originals[i]; if (!(original instanceof MeshStandardMaterial)) continue;
      const geometry: BufferGeometry = node.geometry.clone();
      if (originals.length > 1) {
        const group = geometry.groups.find(g => g.materialIndex === i);
        if (!group || !geometry.index) { geometry.dispose(); continue; }
        geometry.setIndex(Array.from(geometry.index.array.slice(group.start, group.start + group.count)));
      }
      geometry.clearGroups(); geometry.applyMatrix4(normalize.clone().multiply(node.matrixWorld));
      const name = `${original.name} ${node.name}`.toLowerCase();
      const paint = /paint|bodypaint|carpaint|karosserie/.test(name);
      const key = `${original.uuid}-${paint}`;
      let bucket = buckets.get(key);
      if (!bucket) {
        const material = original.clone();
        if (paint) { material.side = DoubleSide; material.color.setScalar(1); material.metalness = .65; material.roughness = .23; if (material instanceof MeshPhysicalMaterial) { material.clearcoat = 1; material.clearcoatRoughness = .12; } }
        bucket = { parts: [], material, paint }; buckets.set(key, bucket);
      }
      bucket.parts.push(geometry);
    }
  });
  const output: VehiclePart[] = [];
  for (const bucket of buckets.values()) {
    const geometry = mergeGeometries(bucket.parts); bucket.parts.forEach(part => part.dispose());
    if (geometry) output.push({ geometry, material: bucket.material, paint: bucket.paint }); else bucket.material.dispose();
  }
  if (!output.length) throw new Error('Fahrzeugmodell enthält keine nutzbare Geometrie.');
  return output;
}

export function disposeVehicle(parts: VehiclePart[]) { parts.forEach(part => { part.geometry.dispose(); part.material.dispose(); }); }