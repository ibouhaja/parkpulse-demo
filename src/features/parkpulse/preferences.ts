import { defaultFilters, vehicleDefaults, type ParkingFilters, type Needs } from './parking-plan';
export const preferenceVehicles = { car:'PKW', ev:'Elektroauto', suv:'SUV', van:'Transporter', camper:'Wohnmobil' } as const;
export type Preferences = { vehicle: keyof typeof preferenceVehicles; height: number; width: number; needs: Needs };
export function vehiclePreferences(vehicle: Preferences['vehicle']): Preferences {
 const preset=vehicle==='camper'?{height:3.1,width:2.3}:vehicleDefaults[vehicle];
 return {vehicle,height:preset.height,width:preset.width,needs:{...defaultFilters.needs}};
}
export const defaultPreferences: Preferences=vehiclePreferences('car');
export function normalizePreferences(input:unknown):Preferences {
 const s=input&&typeof input==='object'?input as Record<string,unknown>:{};
 const vehicle=Object.keys(preferenceVehicles).find(v=>v===s['vehicle']) as Preferences['vehicle']|undefined;
 const base=vehiclePreferences(vehicle??'car');
 const needs=s['needs']&&typeof s['needs']==='object'?s['needs'] as Record<string,unknown>:{};
 const dimension=(v:unknown,fallback:number)=>typeof v==='number'&&Number.isFinite(v)&&v>=0.5&&v<=5?v:fallback;
 return {...base,height:dimension(s['height'],base.height),width:dimension(s['width'],base.width),needs:{wallbox:needs['wallbox']===true,family:needs['family']===true,women:needs['women']===true,accessible:needs['accessible']===true}};
}
export function preferencesFilters(input:unknown):ParkingFilters {
 const p=normalizePreferences(input);const vehicle=p.vehicle==='camper'?'van':p.vehicle;
 return {vehicle,...vehicleDefaults[vehicle],...(p.vehicle==='camper'?{length:7,weight:3500}:{}),height:p.height,width:p.width,needs:{...p.needs}};
}