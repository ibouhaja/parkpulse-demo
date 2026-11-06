import { Car, Zap, Baby, Accessibility, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categoryLabels, categoryLabelsEn, vehicleLabels, vehicleLabelsEn, vehicleDefaults, type ParkingFilters, type ParkingSpot, type VehicleType, type Needs } from './parking-plan';
import { useI18n } from './i18n';

export const categoryIcons = { standard: Car, ev: Zap, family: Baby, women: ShieldCheck, accessible: Accessibility, van: Truck, truck: Truck };
export const shortCategories = { standard: 'Standard', ev: 'E-Auto', family: 'Familie', women: 'Frauen', accessible: 'Barrierefrei', van: 'Transporter', truck: 'LKW' };
export const shortCategoriesEn: Record<keyof typeof shortCategories, string> = { standard: 'Standard', ev: 'EV', family: 'Family', women: 'Women', accessible: 'Accessible', van: 'Van', truck: 'Truck' };
const needLabels: Record<keyof Needs, string> = { wallbox: 'Wallbox / Ladestation', family: 'Familienparkplatz', women: 'Frauenparkplatz', accessible: 'Barrierefreier Zugang' };

export function ParkingFiltersView({ filters, onChange }: { filters: ParkingFilters; onChange: (next: ParkingFilters) => void }) {
  const { t, lang } = useI18n();
  const vehicles = lang === 'en' ? vehicleLabelsEn : vehicleLabels;
  return <div className="parking-filters">
    <label className="parking-vehicle-label">{t('Fahrzeugart')}<select value={filters.vehicle} onChange={e => { const vehicle = e.target.value as VehicleType; onChange({ ...filters, vehicle, ...vehicleDefaults[vehicle] }); }}>{Object.entries(vehicles).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
    <fieldset><legend>{t('Zusätzliche Bedürfnisse')}</legend><div className="parking-needs">{(Object.keys(needLabels) as (keyof Needs)[]).map(key => <label className="filter-switch" key={key}><input type="checkbox" checked={filters.needs[key]} onChange={e => onChange({ ...filters, needs: { ...filters.needs, [key]: e.target.checked } })}/>{t(needLabels[key])}</label>)}</div></fieldset>
    <details className="parking-vehicle-dimensions"><summary>{t('Fahrzeugmaße und Gewicht · Demo-Vorgaben anpassen')}</summary><div>{([{ key: 'height', label: t('Fahrzeughöhe (m)'), step: 0.05 }, { key: 'length', label: t('Fahrzeuglänge (m)'), step: 0.1 }, { key: 'width', label: t('Fahrzeugbreite (m)'), step: 0.05 }, { key: 'weight', label: t('Fahrzeuggewicht (kg)'), step: 100 }] as const).map(field => <label key={field.key}>{field.label}<input type="number" min={field.step} step={field.step} value={filters[field.key] || ''} onChange={e => onChange({ ...filters, [field.key]: Number(e.target.value) })}/></label>)}</div><p>{t('Fiktive Beispielwerte – die tatsächlichen Fahrzeugmaße inklusive Anbauten und das Gesamtgewicht können abweichen.')}</p></details>
  </div>;
}

export function SpotProperties({ spot }: { spot: ParkingSpot }) {
  const { t, lang, locale } = useI18n();
  const categories = lang === 'en' ? categoryLabelsEn : categoryLabels;
  return <div className="parking-properties" aria-label={t('Stellplatzeigenschaften')}><h3>{spot.level} · {spot.bay} · {categories[spot.category]}</h3><p>{t('Alle Eigenschaften sind fiktive Demo-Daten.')}</p><dl>
    <div><dt>{t('Max. Einfahrtshöhe')}</dt><dd>{spot.maxHeight === null ? t('Offenes Gelände · keine Höhenbegrenzung (Demo)') : `${spot.maxHeight.toLocaleString(locale)} m`}</dd></div>
    <div><dt>{t('Länge × Breite')}</dt><dd>{spot.length.toLocaleString(locale)} × {spot.width.toLocaleString(locale)} m</dd></div>
    <div><dt>{t('Zulässiges Fahrzeuggewicht')}</dt><dd>{spot.maxWeight.toLocaleString(locale)} kg</dd></div>
    <div><dt>{t('Ladestation')}</dt><dd>{spot.charging ? `${spot.charging.power} kW · ${spot.charging.mode === 'DC' ? t('DC-Schnellladung') : t('AC-Wallbox')} · ${spot.charging.connector}` : t('Keine Ladestation')}</dd></div>
    <div><dt>{t('Barrierefreier Zugang')}</dt><dd>{spot.accessible ? t('Ja (fiktiv)') : t('Nicht ausgewiesen')}</dd></div>
    <div><dt>{t('Beleuchtung & Sicherheit')}</dt><dd>{spot.lighting ? spot.security : t('Nicht ausgewiesen')}</dd></div>
    <div><dt>{t('Entfernung zum')} {spot.exitType}</dt><dd>{spot.exitDistance} {t('m (fiktiv)')}</dd></div>
    <div><dt>{t('Belegung')}</dt><dd>{spot.unknown ? t('Ungeklärt – Auswahl gesperrt') : spot.occupied ? t('Belegt – Auswahl gesperrt') : t('Frei (simuliert)')}</dd></div>
  </dl></div>;
}

export function FilterReset({ onReset }: { onReset: () => void }) { const { t } = useI18n(); return <Button variant="outline" onClick={onReset}>{t('Bedürfnisse zurücksetzen')}</Button>; }
