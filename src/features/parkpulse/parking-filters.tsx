import { Car, Zap, Baby, Accessibility, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categoryLabels, vehicleLabels, vehicleDefaults, type ParkingFilters, type ParkingSpot, type VehicleType, type Needs } from './parking-plan';

export const categoryIcons = { standard: Car, ev: Zap, family: Baby, women: ShieldCheck, accessible: Accessibility, van: Truck, truck: Truck };
export const shortCategories = { standard: 'Standard', ev: 'E-Auto', family: 'Familie', women: 'Frauen', accessible: 'Barrierefrei', van: 'Transporter', truck: 'LKW' };
const needLabels: Record<keyof Needs, string> = { wallbox: 'Wallbox / Ladestation', family: 'Familienparkplatz', women: 'Frauenparkplatz', accessible: 'Barrierefreier Zugang' };

export function ParkingFiltersView({ filters, onChange }: { filters: ParkingFilters; onChange: (next: ParkingFilters) => void }) {
  return <div className="parking-filters">
    <label className="parking-vehicle-label">Fahrzeugart<select value={filters.vehicle} onChange={e => { const vehicle = e.target.value as VehicleType; onChange({ ...filters, vehicle, ...vehicleDefaults[vehicle] }); }}>{Object.entries(vehicleLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
    <fieldset><legend>Zusätzliche Bedürfnisse</legend><div className="parking-needs">{(Object.keys(needLabels) as (keyof Needs)[]).map(key => <label className="filter-switch" key={key}><input type="checkbox" checked={filters.needs[key]} onChange={e => onChange({ ...filters, needs: { ...filters.needs, [key]: e.target.checked } })}/>{needLabels[key]}</label>)}</div></fieldset>
    <details className="parking-vehicle-dimensions"><summary>Fahrzeugmaße und Gewicht · Demo-Vorgaben anpassen</summary><div>{([{ key: 'height', label: 'Fahrzeughöhe (m)', step: 0.05 }, { key: 'length', label: 'Fahrzeuglänge (m)', step: 0.1 }, { key: 'width', label: 'Fahrzeugbreite (m)', step: 0.05 }, { key: 'weight', label: 'Fahrzeuggewicht (kg)', step: 100 }] as const).map(field => <label key={field.key}>{field.label}<input type="number" min={field.step} step={field.step} value={filters[field.key] || ''} onChange={e => onChange({ ...filters, [field.key]: Number(e.target.value) })}/></label>)}</div><p>Fiktive Beispielwerte – die tatsächlichen Fahrzeugmaße inklusive Anbauten und das Gesamtgewicht können abweichen.</p></details>
  </div>;
}

export function SpotProperties({ spot }: { spot: ParkingSpot }) {
  return <div className="parking-properties" aria-label="Stellplatzeigenschaften"><h3>{spot.level} · {spot.bay} · {categoryLabels[spot.category]}</h3><p>Alle Eigenschaften sind fiktive Demo-Daten.</p><dl>
    <div><dt>Max. Einfahrtshöhe</dt><dd>{spot.maxHeight === null ? 'Offenes Gelände · keine Höhenbegrenzung (Demo)' : `${spot.maxHeight.toLocaleString('de-DE')} m`}</dd></div>
    <div><dt>Länge × Breite</dt><dd>{spot.length.toLocaleString('de-DE')} × {spot.width.toLocaleString('de-DE')} m</dd></div>
    <div><dt>Zulässiges Fahrzeuggewicht</dt><dd>{spot.maxWeight.toLocaleString('de-DE')} kg</dd></div>
    <div><dt>Ladestation</dt><dd>{spot.charging ? `${spot.charging.power} kW · ${spot.charging.mode === 'DC' ? 'DC-Schnellladung' : 'AC-Wallbox'} · ${spot.charging.connector}` : 'Keine Ladestation'}</dd></div>
    <div><dt>Barrierefreier Zugang</dt><dd>{spot.accessible ? 'Ja (fiktiv)' : 'Nicht ausgewiesen'}</dd></div>
    <div><dt>Beleuchtung & Sicherheit</dt><dd>{spot.lighting ? spot.security : 'Nicht ausgewiesen'}</dd></div>
    <div><dt>Entfernung zum {spot.exitType}</dt><dd>{spot.exitDistance} m (fiktiv)</dd></div>
    <div><dt>Belegung</dt><dd>{spot.unknown ? 'Ungeklärt – Auswahl gesperrt' : spot.occupied ? 'Belegt – Auswahl gesperrt' : 'Frei (simuliert)'}</dd></div>
  </dl></div>;
}

export function FilterReset({ onReset }: { onReset: () => void }) { return <Button variant="outline" onClick={onReset}>Bedürfnisse zurücksetzen</Button>; }