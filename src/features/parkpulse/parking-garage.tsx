import { useEffect, useMemo } from 'react';
import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import type { ParkingLevel } from './parking-plan';

export type GaragePalette = Record<'concrete' | 'ink' | 'paint' | 'steel' | 'selected' | 'wallbox', string>;

function concreteTexture(colors: GaragePalette) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = colors.concrete; ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 18000; i++) {
      ctx.globalAlpha = .025 + (i % 5) * .008;
      ctx.fillStyle = i % 2 ? colors.ink : colors.paint;
      ctx.fillRect((i * 137) % 512, (i * 269) % 512, i % 3 + 1, 1);
    }
    ctx.globalAlpha = .12; ctx.strokeStyle = colors.ink; ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 511, 511);
  }
  const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace;
  texture.wrapS = texture.wrapT = RepeatWrapping; texture.repeat.set(2, 2);
  return texture;
}

function Sign({ text, colors, position, width = 4 }: { text: string; colors: GaragePalette; position: [number, number, number]; width?: number }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = colors.ink; ctx.fillRect(0, 0, 1024, 256);
      ctx.fillStyle = colors.paint; ctx.font = '600 94px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(text, 512, 128);
    }
    const result = new CanvasTexture(canvas); result.colorSpace = SRGBColorSpace; return result;
  }, [text, colors]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={position}><boxGeometry args={[width, width / 4, .12]}/><meshStandardMaterial map={texture} roughness={.45}/></mesh>;
}

// Open front and removable ceiling are an architectural cutaway, not a miniature building.
export function GarageArchitecture({ colors, level }: { colors: GaragePalette; level: ParkingLevel }) {
  const texture = useMemo(() => concreteTexture(colors), [colors]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <group>
    <mesh position={[0, 2.3, -17.8]} receiveShadow castShadow><boxGeometry args={[48, 4.6, .45]}/><meshStandardMaterial map={texture} roughness={.9}/></mesh>
    {[-23.8, 23.8].map(x => <group key={x}>
      <mesh position={[x, 1, 0]} receiveShadow><boxGeometry args={[.4, 2, 36]}/><meshStandardMaterial map={texture} roughness={.9}/></mesh>
      <mesh position={[x, 1.1, 0]}><boxGeometry args={[.42, .24, 36]}/><meshStandardMaterial color={colors.selected} roughness={.55}/></mesh>
    </group>)}
    {[-22, -11.1, 0, 11.1, 22].map(x => <group key={x}>
      {[-16.8, 0, 16.8].map(z => <group key={z} position={[x, 0, z]}>
        <mesh position-y={2.3} receiveShadow castShadow><boxGeometry args={[.65, 4.6, .65]}/><meshStandardMaterial map={texture} roughness={.92}/></mesh>
        <mesh position-y={.65}><boxGeometry args={[.67, .65, .67]}/><meshStandardMaterial color={colors.selected} roughness={.6}/></mesh>
        <mesh position-y={.18}><boxGeometry args={[.74, .15, .74]}/><meshStandardMaterial color={colors.ink}/></mesh>
      </group>)}
      <mesh position={[x, 4.65, 0]} castShadow><boxGeometry args={[.55, .4, 36]}/><meshStandardMaterial map={texture} roughness={.9}/></mesh>
    </group>)}
    {[-7.9, 7.9].map(z => <group key={z}>
      <mesh position={[0, 4.4, z]}><boxGeometry args={[45, .12, .18]}/><meshStandardMaterial color={colors.steel} metalness={.7} roughness={.35}/></mesh>
      {[-18, -9, 0, 9, 18].map(x => <group key={x} position={[x, 4.25, z]}>
        <mesh><boxGeometry args={[2.4, .09, .36]}/><meshStandardMaterial color={colors.steel} metalness={.6}/></mesh>
        <mesh position-y={-.055}><boxGeometry args={[2.2, .02, .26]}/><meshStandardMaterial color={colors.paint} emissive={colors.paint} emissiveIntensity={3}/></mesh>
      </group>)}
    </group>)}
    <Sign text={`${level}  |  PARKPULSE`} colors={colors} position={[-8, 3.3, -17.5]} width={6}/>
    <Sign text="AUSFAHRT  →" colors={colors} position={[10, 3.3, -17.5]} width={5}/>
    <Sign text={`${level}  ↓  E-LADEN`} colors={colors} position={[0, 3.65, -.5]} width={4}/>
    <mesh position={[0, 1.1, -17.53]}><boxGeometry args={[48, .25, .025]}/><meshStandardMaterial color={colors.selected}/></mesh>
  </group>;
}