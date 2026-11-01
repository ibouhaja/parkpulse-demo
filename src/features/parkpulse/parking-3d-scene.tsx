import { Suspense, useEffect, useMemo, useRef, useState, Component, type ReactNode } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls, useGLTF } from '@react-three/drei';
import { CanvasTexture, Color, Group, InstancedMesh, Object3D, SRGBColorSpace, Vector3, CatmullRomCurve3 } from 'three';
import { prepareVehicle, disposeVehicle, type VehiclePart } from './parking-vehicle-asset';
import { GarageArchitecture } from './parking-garage';
import { Eye, RotateCcw, Play, Building2, CarFront, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import compact from '@/assets/models/parkpulse-real-compact.glb.asset.json';
import sedan from '@/assets/models/parkpulse-real-sedan.glb.asset.json';
import suv from '@/assets/models/parkpulse-real-suv.glb.asset.json';
import van from '@/assets/models/parkpulse-real-van.glb.asset.json';
import { cameraPose, demoModels, demoModelLabels, parkingPose, PARKING_ANIMATION_SECONDS, sceneSpots, spotCoordinates, type CameraView, type DemoModel } from './parking-3d-rules';
import { parkingLevels, type ParkingSpot, type ParkingPosition, type ParkingFilters, type ParkingLevel } from './parking-plan';

const urls = { compact: compact.url, sedan: sedan.url, suv: suv.url, van: van.url };
type Palette = Record<'concrete' | 'ink' | 'free' | 'occupied' | 'selected' | 'unknown' | 'paint' | 'steel' | 'wallbox' | 'sky' | 'carTeal' | 'carRed' | 'carGold' | 'carSilver' | 'carBlue', string>;
const colorKeys = ['carTeal', 'carRed', 'carGold', 'carSilver', 'carBlue'] as const;
type Props = { spots: ParkingSpot[]; level: ParkingLevel; filters: ParkingFilters; selected: ParkingPosition | null; saved: ParkingPosition | null; model: DemoModel; onModel: (model: DemoModel) => void; onSelect: (spot: ParkingSpot) => void };

function surface(spots: ParkingSpot[], selected: ParkingPosition | null, colors: Palette) {
  const canvas = document.createElement('canvas'); canvas.width = 2048; canvas.height = 1536;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = colors.concrete; ctx.fillRect(0, 0, 2048, 1536);
    for (let i = 0; i < 18000; i++) {
      ctx.globalAlpha = .035; ctx.fillStyle = i % 2 ? colors.paint : colors.ink;
      ctx.fillRect((i * 739) % 2048, (i * 313) % 1536, 2, 2);
    }
    ctx.globalAlpha = 1;
    const px = (x: number) => (x + 24) / 48 * 2048;
    const pz = (z: number) => (z + 18) / 36 * 1536;
    for (const z of [-7.9, 7.9]) {
      ctx.strokeStyle = colors.paint; ctx.lineWidth = 3; ctx.setLineDash([25, 20]);
      ctx.beginPath(); ctx.moveTo(px(-22), pz(z)); ctx.lineTo(px(22), pz(z)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = colors.paint; ctx.font = 'bold 42px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('→     →     →', px(0), pz(z) + 14);
    }
    for (const spot of spots) {
      const { x, z } = spotCoordinates(spot.bay);
      const active = selected?.bay === spot.bay && selected.level === spot.level;
      ctx.fillStyle = active ? colors.selected : spot.unknown ? colors.unknown : spot.occupied ? colors.occupied : colors.free;
      ctx.globalAlpha = active ? .65 : .22; ctx.fillRect(px(x - 1.7), pz(z - 2.7), 3.4 / 48 * 2048, 5.4 / 36 * 1536); ctx.globalAlpha = 1;
      ctx.fillRect(px(x - 1.7), pz(z + 1.85), 3.4 / 48 * 2048, .85 / 36 * 1536);
      ctx.strokeStyle = colors.paint; ctx.lineWidth = 4; ctx.strokeRect(px(x - 1.7), pz(z - 2.7), 3.4 / 48 * 2048, 5.4 / 36 * 1536);
      ctx.fillStyle = colors.paint; ctx.font = 'bold 28px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(spot.bay, px(x), pz(z + 2.2));
      const icon = spot.category === 'accessible' ? '♿' : spot.category === 'family' ? 'Familie' : spot.category === 'women' ? 'Frauen' : spot.category === 'van' ? 'XL' : '';
      ctx.font = 'bold 19px sans-serif'; ctx.fillText(icon, px(x), pz(z - 2));
      if (spot.charging) ctx.fillText(`⚡ ${spot.charging.power} kW`, px(x), pz(z - 1.3));
      if (spot.unknown) { ctx.font = 'bold 70px sans-serif'; ctx.fillText('?', px(x), pz(z)); }
    }
  }
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace; texture.anisotropy = 4;
  return texture;
}

function CarInstances({ part, spots, colors }: { part: VehiclePart; spots: ParkingSpot[]; colors: Palette }) {
  const ref = useRef<InstancedMesh>(null);
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => {
    const mesh = ref.current; if (!mesh) return;
    const transform = new Object3D();
    spots.forEach((spot, i) => { const p = spotCoordinates(spot.bay); transform.position.set(p.x, .13, p.z); transform.rotation.y = p.yaw; transform.updateMatrix(); mesh.setMatrixAt(i, transform.matrix); if (part.paint) mesh.setColorAt(i, new Color(colors[colorKeys[(Number(spot.bay.slice(1)) + i) % colorKeys.length] ?? 'carSilver'])); });
    mesh.instanceMatrix.needsUpdate = true; if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
    part.material.needsUpdate = true;
    invalidate();
  }, [spots, colors, part, invalidate]);
  return <instancedMesh ref={ref} args={[part.geometry, part.material, 48]} count={spots.length} castShadow receiveShadow/>;
}

function Cars({ model, spots, colors }: { model: DemoModel; spots: ParkingSpot[]; colors: Palette }) {
  const { scene } = useGLTF(urls[model], false);
  const parts = useMemo(() => prepareVehicle(scene, model), [scene, model]);
  useEffect(() => () => disposeVehicle(parts), [parts]);
  return <group>{parts.map((part, index) => <CarInstances key={index} part={part} spots={spots} colors={colors}/>)}</group>;
}

function DemoCar({ model, bay, run, colors, reduced }: { model: DemoModel; bay: string; run: number; colors: Palette; reduced: boolean }) {
  const { scene } = useGLTF(urls[model], false);
  const group = useRef<Group>(null); const clock = useRef(1);
  const parts = useMemo(() => prepareVehicle(scene, model), [scene, model]);
  useEffect(() => { parts.forEach(part => { if (part.paint) part.material.color.set(colors.carBlue); }); }, [parts, colors]);
  useEffect(() => () => disposeVehicle(parts), [parts]);
  useEffect(() => { clock.current = reduced || run === 0 ? 1 : 0; }, [run, bay, reduced]);
  useFrame((state, delta) => {
    clock.current = Math.min(1, clock.current + Math.min(delta, .05) / PARKING_ANIMATION_SECONDS);
    const pose = parkingPose(bay, clock.current); if (group.current) { group.current.position.set(pose.x, .14, pose.z); group.current.rotation.y = pose.yaw; }
    if (clock.current < 1) state.invalidate();
  });
  return <group ref={group}>{parts.map((part, index) => <mesh key={index} geometry={part.geometry} material={part.material} castShadow receiveShadow/>)}</group>;
}

function Ready({ onReady }: { onReady: () => void }) { const sent = useRef(false); useFrame(() => { if (!sent.current) { sent.current = true; onReady(); } }); return null; }
function CameraRig({ view, selected, building, reset, reduced }: { view: CameraView; selected: ParkingPosition | null; building: boolean; reset: number; reduced: boolean }) {
  const { camera, invalidate } = useThree(); const controls = useRef<import('three-stdlib').OrbitControls>(null);
  const destination = useRef(cameraPose(view)); const moving = useRef(false);
  useEffect(() => { destination.current = cameraPose(view, selected?.bay, building); moving.current = true; invalidate(); }, [view, selected?.bay, selected?.level, building, reset, invalidate]);
  useFrame((state, delta) => {
    const orbit = controls.current; if (!moving.current || !orbit) return;
    const p = new Vector3(...destination.current.position); const t = new Vector3(...destination.current.target);
    const amount = reduced ? 1 : 1 - Math.exp(-5 * Math.min(delta, .1));
    camera.position.lerp(p, amount); orbit.target.lerp(t, amount); orbit.update();
    moving.current = camera.position.distanceTo(p) > .03 || orbit.target.distanceTo(t) > .03;
    if (moving.current) state.invalidate();
  });
  return <OrbitControls ref={controls} makeDefault minDistance={view === 'driver' ? 1 : 4} maxDistance={100} maxPolarAngle={Math.PI / 2.01} enablePan enableDamping dampingFactor={.1} onStart={() => { moving.current = false; }}/>;
}

function Floor({ spots, selected, colors, onSelect }: { spots: ParkingSpot[]; selected: ParkingPosition | null; colors: Palette; onSelect: Props['onSelect'] }) {
  const texture = useMemo(() => surface(spots, selected, colors), [spots, selected, colors]);
  useEffect(() => () => texture.dispose(), [texture]);
  const click = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); const local = event.object.worldToLocal(event.point.clone()); const spot = spots.find(s => { const p = spotCoordinates(s.bay); return Math.abs(local.x - p.x) < 1.7 && Math.abs(-local.y - p.z) < 2.7; }); if (spot && !spot.occupied && !spot.unknown && event.delta < 6) onSelect(spot); };
  return <group>
    <mesh rotation-x={-Math.PI / 2} position-y={.1} receiveShadow onClick={click}><planeGeometry args={[48, 36]}/><meshStandardMaterial map={texture} roughness={.88}/></mesh>
    <mesh position-y={-.3} receiveShadow><boxGeometry args={[48, .6, 36]}/><meshStandardMaterial color={colors.concrete}/></mesh>
    {spots.filter(s => s.charging || ['family', 'women', 'accessible'].includes(s.category)).map(spot => {
      const p = spotCoordinates(spot.bay); const signZ = p.z + (p.yaw === 0 ? 2.5 : -2.5);
      return <group key={spot.bay} position={[p.x + 1.3, 0, signZ]}>
        <mesh position-y={.7}><boxGeometry args={[.12, 1.4, .12]}/><meshStandardMaterial color={colors.steel}/></mesh>
        <mesh position-y={1.5}><boxGeometry args={[.45, .6, .2]}/><meshStandardMaterial color={spot.charging ? colors.wallbox : spot.category === 'women' ? colors.selected : colors.free}/></mesh>
        {spot.charging && <><mesh position={[0, 1.55, .12]}><boxGeometry args={[.26, .16, .04]}/><meshStandardMaterial color={colors.ink} roughness={.15}/></mesh><mesh position={[0, 1.36, .13]}><boxGeometry args={[.22, .035, .025]}/><meshStandardMaterial color={colors.free} emissive={colors.free} emissiveIntensity={.6}/></mesh><mesh><tubeGeometry args={[new CatmullRomCurve3([new Vector3(.18,1.25,0),new Vector3(.4,.9,.1),new Vector3(.25,.45,.15),new Vector3(.04,.8,.15)]),12,.025,6,false]}/><meshStandardMaterial color={colors.ink}/></mesh></>}
        {spot.accessible && <mesh position={[.25, .35, 0]}><boxGeometry args={[.12, .7, .12]}/><meshStandardMaterial color={colors.paint}/></mesh>}
      </group>;
    })}
  </group>;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() { return this.state.failed ? <p role="alert" className="parking-3d-error">Die 3D-Ansicht konnte nicht geladen werden. Bitte nutze den 2D-Parkhausplan oder lade die Seite neu.</p> : this.props.children; }
}

export default function Parking3DScene(props: Props) {
  const [colors, setColors] = useState<Palette | null>(null); const [ready, setReady] = useState(false); const [view, setView] = useState<CameraView>('isometric'); const [run, setRun] = useState(0); const [reduced, setReduced] = useState(false);
  const [expanded, setExpanded] = useState(false); const [reset, setReset] = useState(0);
  const [building, setBuilding] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  useEffect(() => { const css = getComputedStyle(document.documentElement); const values = {} as Palette; for (const key of ['concrete', 'ink', 'free', 'occupied', 'selected', 'unknown', 'paint', 'steel', 'wallbox', 'sky', ...colorKeys] as (keyof Palette)[]) values[key] = css.getPropertyValue(`--scene-${key}`).trim(); setColors(values); setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  const ownSpot = props.selected ?? props.saved;
  const floors = building ? parkingLevels : [props.level];
  return <div className={`parking-3d ${expanded ? 'is-expanded' : ''}`}>
    <div className="parking-3d-tools"><label>Dein Demo-Fahrzeug<select aria-label="Dein Demo-Fahrzeug" value={props.model} onChange={e => props.onModel(e.target.value as DemoModel)}>{demoModels.map(m => <option key={m} value={m}>{demoModelLabels[m]}</option>)}</select></label><div><Button variant={building ? 'default' : 'outline'} size="icon" title="Gesamtes Parkhaus / einzelne Ebene" aria-label="Gesamtes Parkhaus" aria-pressed={building} onClick={() => setBuilding(b => !b)}><Building2/></Button><Button variant={view === 'bird' ? 'default' : 'outline'} size="icon" title="Vogelperspektive" aria-label="Vogelperspektive" onClick={() => { setView('bird'); setBuilding(false); setReset(r => r + 1); }}><Eye/></Button><Button variant={view === 'driver' ? 'default' : 'outline'} size="icon" title="Fahrerperspektive" aria-label="Fahrerperspektive" onClick={() => { setView('driver'); setBuilding(false); setReset(r => r + 1); }}><CarFront/></Button><Button variant="outline" size="icon" title="Ansicht zurücksetzen" aria-label="Ansicht zurücksetzen" onClick={() => { setView('isometric'); setBuilding(false); setReset(r => r + 1); }}><RotateCcw/></Button><Button variant="outline" size="icon" title={expanded ? 'Ansicht verkleinern' : 'Ansicht vergrößern'} aria-label={expanded ? 'Ansicht verkleinern' : 'Ansicht vergrößern'} onClick={() => setExpanded(e => !e)}>{expanded ? <Minimize/> : <Maximize/>}</Button><Button variant="outline" disabled={!props.selected} onClick={() => setRun(r => r + 1)}><Play/>Einparken (Demo)</Button></div></div>
    <div className="parking-3d-canvas" ref={wrapper} data-scene-ready={ready ? 'true' : undefined} aria-label={`Interaktiver 3D-Parkhausplan ${props.level}`}>
      <SceneBoundary>{colors && <Canvas shadows frameloop="demand" dpr={[1, 1.5]} camera={{ position: [16, 23, 26], fov: 54, near: .1, far: 200 }} gl={{ antialias: true }}>
        <color attach="background" args={[colors.sky]}/><hemisphereLight args={[colors.paint, colors.steel, 1.2]}/><directionalLight position={[12, 28, 20]} intensity={2.5} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-30} shadow-camera-right={30} shadow-camera-top={26} shadow-camera-bottom={-26} shadow-normalBias={.025}/>
        <Environment resolution={128}><Lightformer intensity={2} position={[0, 15, 0]} scale={[40, 30, 1]}/><Lightformer intensity={1} position={[-25, 5, 0]} rotation-y={Math.PI / 2} scale={[40, 10, 1]}/></Environment>
        {floors.map((floor, floorIndex) => {
          const spots = sceneSpots(props.spots, floor, props.filters);
          const ownVisible = ownSpot?.level === floor && spots.some(s => s.bay === ownSpot.bay && !s.unknown);
          const cars = spots.filter(s => s.occupied && !s.unknown && (!ownVisible || ownSpot?.bay !== s.bay));
          return <group key={floor} position-y={building ? floorIndex * 7 : 0}>
            <Floor spots={spots} selected={props.selected} colors={colors} onSelect={props.onSelect}/>
            <GarageArchitecture colors={colors} level={floor}/>
            <Suspense fallback={null}>{demoModels.map((model, index) => <Cars key={model} model={model} colors={colors} spots={cars.filter(s => (Number(s.bay.slice(1)) + Math.floor(Number(s.bay.slice(1)) / 12)) % 4 === index)}/>)}{ownSpot && ownVisible && <DemoCar key={`${ownSpot.level}-${ownSpot.bay}-${props.model}`} model={props.model} bay={ownSpot.bay} run={run} colors={colors} reduced={reduced}/>}<Ready onReady={() => setReady(true)}/></Suspense>
          </group>;
        })}
        <CameraRig view={view} selected={props.selected} building={building} reset={reset} reduced={reduced}/>
      </Canvas>}</SceneBoundary>
      <span className="parking-3d-floor-tag"><Building2 size={14}/>{building ? 'P1 · P2 · P3' : props.level} · 3D · Simulation</span>
      {!ready && <span className="parking-3d-loading" role="status">3D-Fahrzeuge werden geladen …</span>}
    </div>
  </div>;
}