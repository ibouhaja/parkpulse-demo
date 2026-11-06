import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Camera, Car, Check, Navigation, RefreshCw, Save, CircleHelp, Zap } from 'lucide-react';
import { ClientOnly, Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useDemo } from './store';
import { parkingLevels, spotsPerLevel, occupancyStats, selectFreeSpot, savePlanPosition, matchesSpot, defaultFilters, categoryLabels, categoryLabelsEn, type ParkingLevel, type ParkingPosition } from './parking-plan';
import { ParkingFiltersView, SpotProperties, FilterReset, categoryIcons, shortCategories, shortCategoriesEn } from './parking-filters';
import { facilities } from './data';
import { useParkingPlan } from './parking-plan-provider';
import { filtersForModel, type DemoModel } from './parking-3d-rules';
import { useI18n } from './i18n';

const Parking3DScene = lazy(() => import('./parking-3d-scene'));

export function ParkingPlanView({ facilityId }: { facilityId: string }) {
  const { plans, simulate } = useParkingPlan();
  const { state, ready, signedIn, saveLocation } = useDemo();
  const { t, lang } = useI18n();
  const categories = lang === 'en' ? categoryLabelsEn : categoryLabels;
  const shortCats = lang === 'en' ? shortCategoriesEn : shortCategories;
  const [level, setLevel] = useState<ParkingLevel>('P1');
  const [selected, setSelected] = useState<ParkingPosition | null>(null);
  const [auto, setAuto] = useState(false);
  const [notice, setNotice] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [inspected, setInspected] = useState('');
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [demoModel, setDemoModel] = useState<DemoModel>('sedan');
  const plan = plans[facilityId];
  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(() => simulate(facilityId), 4000);
    return () => clearInterval(timer);
  }, [auto, facilityId, simulate]);
  useEffect(() => {
    if (selected && plan && !selectFreeSpot(plan.spots, selected, filters)) {
      setSelected(null);
      if (state.session?.facilityId === facilityId && state.session.level === selected.level && state.session.bay === selected.bay) return;
      setNotice(t('Der ausgewählte Stellplatz ist nicht mehr frei oder passt nicht zu deinen Kriterien. Bitte wähle erneut.'));
    }
  }, [plan, selected, filters, state.session, facilityId]);
  if (!plan) return null;
  const visible = plan.spots.filter(s => s.level === level);
  const totals = occupancyStats(plan.spots);
  const floorTotals = occupancyStats(visible);
  const matching = visible.filter(s => matchesSpot(s, filters));
  const free = matching.filter(s => !s.occupied && !s.unknown).length;
  const unknown = matching.filter(s => s.unknown).length;
  const currentSelection = selected ? selectFreeSpot(plan.spots, selected, filters) : null;
  const selectedSpot = plan.spots.find(s => s.level === currentSelection?.level && s.bay === currentSelection.bay);
  const inspectedSpot = matching.find(s => s.bay === inspected);
  const detailSpot = inspectedSpot ?? selectedSpot;
  const otherLevels = parkingLevels.filter(floor => floor !== level && plan.spots.some(s => s.level === floor && matchesSpot(s, filters) && !s.occupied && !s.unknown));
  const alternatives = facilities.filter(p => p.id !== facilityId && plans[p.id]?.spots.some(s => matchesSpot(s, filters) && !s.occupied && !s.unknown));
  const matchingSession = state.session?.facilityId === facilityId && state.session.status === 'active';
  const savedPosition = state.session?.facilityId === facilityId && state.session.level && state.session.bay
    ? `${state.session.level} · ${state.session.bay}` : null;
  const save = () => {
    if (!currentSelection || savePlanPosition(state, facilityId, plan.spots, currentSelection, filters) === state) return;
    if (saveLocation(currentSelection.level, currentSelection.bay)) setNotice(t('Parkposition erfolgreich gespeichert.'));
  };

  return <section className="parking-overview" aria-label={t('Demo-Stellplatzübersicht')}>
    <div className="section-heading"><div><p className="eyebrow">{t('FIKTIVER PARKHAUSPLAN')}</p><h2>{t('Deinen Stellplatz im Blick')}</h2></div><span className="ev-tag"><Camera size={14}/>{t('Nur Simulation')}</span></div>
    <div className="parking-occupancy-summary" aria-label={t('Gesamtbelegung aller Demo-Ebenen')} role="status"><span><strong>{totals.total}</strong>{t('Gesamtzahl')}</span><span><strong>{totals.free}</strong>{t('Frei')}</span><span><strong>{totals.occupied}</strong>{t('Belegt')}</span><span><strong>{totals.unknown}</strong>{t('Ungeklärt')}</span><span><strong>{totals.percent} %</strong>{t('Auslastung')}</span></div><p className="section-subtitle">{t('Alle drei Demo-Ebenen · unabhängig vom Fahrzeugfilter · ausschließlich simuliert')}</p>
    <ParkingFiltersView filters={filters} onChange={next => { setFilters(next); setInspected(''); }}/>
    <div className="parking-plan-toolbar">
      <div className="parking-levels" role="group" aria-label={t('Parkebene auswählen')}>{parkingLevels.map(floor => <Button key={floor} variant={level === floor ? 'default' : 'outline'} aria-pressed={level === floor} onClick={() => { setLevel(floor); setSelected(null); setNotice(''); }}>{floor}</Button>)}</div>
      <div className="parking-levels" role="group" aria-label={t('Planansicht auswählen')}><Button variant={viewMode === '2d' ? 'default' : 'outline'} aria-pressed={viewMode === '2d'} onClick={() => setViewMode('2d')}>{t('2D-Parkhausplan')}</Button><Button variant={viewMode === '3d' ? 'default' : 'outline'} aria-pressed={viewMode === '3d'} onClick={() => setViewMode('3d')}>{t('3D-Ansicht')}</Button></div>
      <span className="parking-free-count">{free} {t('frei')} · {matching.length - free - unknown} {t('belegt')} · {unknown} {t('ungeklärt')} <small>{t('(passend · fiktiv)')}</small></span>
    </div>
    {viewMode === '3d' ? <ClientOnly fallback={<p role="status">{t('3D-Ansicht wird vorbereitet …')}</p>}><Suspense fallback={<p role="status">{t('3D-Ansicht wird geladen …')}</p>}><Parking3DScene spots={plan.spots} level={level} filters={filters} selected={currentSelection} saved={state.session?.facilityId === facilityId && parkingLevels.includes(state.session.level as ParkingLevel) ? { level: state.session.level as ParkingLevel, bay: state.session.bay } : null} model={demoModel} onModel={model => { setDemoModel(model); setFilters(filtersForModel(filters, model)); setInspected(''); }} onSelect={spot => { setLevel(spot.level); setSelected(selectFreeSpot(plan.spots, spot, filters)); setInspected(''); setNotice(''); }}/></Suspense></ClientOnly> : <div className="parking-floor" aria-label={`Parkhausplan ${level}`}>
      <div className="parking-floor-label"><Navigation size={14}/><span>{t('Einfahrt · ')}{level}</span><span>{spotsPerLevel} {t('Demo-Plätze')} · {floorTotals.free} {t('frei')} · {floorTotals.occupied} {t('belegt')} · {floorTotals.percent} % {t('Auslastung')}</span></div>
      {[0, 1, 2, 3].map(row => <div key={row}>
        {row % 2 === 1 && <div className="parking-aisle"><ArrowRight size={20}/><span>{t('FAHRGASSE')}</span><ArrowRight size={20}/></div>}
        <div className="parking-spots">{visible.slice(row * 12, row * 12 + 12).map(spot => {
          if (!matchesSpot(spot, filters)) return <div key={spot.bay} className="parking-spot-hidden" aria-hidden="true"/>;
          const active = currentSelection?.level === spot.level && currentSelection.bay === spot.bay;
          const Icon = categoryIcons[spot.category];
          const status = spot.unknown ? t('ungeklärt') : spot.occupied ? t('belegt') : t('frei');
          return <Button key={spot.bay} variant="outline" title={`${categories[spot.category]} · ${spot.length} × ${spot.width} m · max. ${spot.maxWeight} kg · ${spot.maxHeight ?? (lang==='en'?'unlimited':'unbegrenzte')} m · ${spot.exitDistance} m · ${spot.exitType}`} className={`parking-spot ${spot.unknown ? 'is-unknown' : spot.occupied ? 'is-occupied' : 'is-free'} ${active ? 'is-selected' : ''}`} disabled={spot.occupied || spot.unknown} aria-label={`${spot.level} ${spot.bay} – ${status} – ${categories[spot.category]}`} aria-pressed={active} onClick={() => { setSelected(selectFreeSpot(plan.spots, spot, filters)); setInspected(''); setNotice(''); }}>
            {spot.unknown ? <CircleHelp/> : spot.occupied ? <Car/> : active ? <Check/> : <Icon/>}<span>{spot.bay}</span><small>{shortCats[spot.category]}</small>{spot.charging && <span className="inline-flex items-center gap-1 text-[9px]" aria-label={`${spot.charging.power} kW`}><Zap className="size-3"/>{spot.charging.power} kW</span>}
          </Button>;
        })}</div>
      </div>)}
      <div className="parking-floor-exit"><ArrowDown size={14}/>{t('Ausfahrt')}</div>
    </div>}
    <div className="parking-plan-legend"><span><i className="spot-free-dot"/>{t('Frei')}</span><span><Car size={14}/>{t('Belegt')}</span><span><CircleHelp size={14}/>{t('Ungeklärt')}</span><span><Check size={14}/>{t('Ausgewählt')}</span></div>
    {free === 0 && <div className="parking-no-match" role="status"><strong>{t('Keine passenden freien Stellplätze auf')} {level}.</strong><p>{matching.length ? t('Passende Plätze sind belegt oder ihre Belegung ist ungeklärt.') : t('Die Stellplätze passen nicht zu deinem Fahrzeug oder den gewählten Bedürfnissen.')} {t('Fahrzeuggrenzen werden nicht gelockert.')}</p><div>{(otherLevels.length ? otherLevels : parkingLevels.filter(floor => floor !== level)).map(floor => <Button key={floor} variant="outline" onClick={() => { setLevel(floor); setSelected(null); setInspected(''); }}>{otherLevels.includes(floor) ? t('Freie Plätze auf') : t('Ebene ansehen:')} {floor}</Button>)}<FilterReset onReset={() => setFilters({ ...filters, needs: { wallbox: false, family: false, women: false, accessible: false } })}/></div>{alternatives.length > 0 && <p>{t('Andere fiktive Parkgelände mit passenden freien Plätzen:')} {alternatives.map(p => <Link key={p.id} to="/parkplatz/$id" params={{ id: p.id }} className="parking-alternative">{p.name}</Link>)}<br/>{t('Bitte Fahrzeug und Bedürfnisse dort erneut einstellen.')}</p>}</div>}
    {matching.length > 0 && <label className="parking-inspect">{t('Stellplatzdetails (auch belegt / ungeklärt)')}<select value={inspected} onChange={e => setInspected(e.target.value)}><option value="">{t('Stellplatz ansehen')}</option>{matching.map(s => <option key={s.bay} value={s.bay}>{s.bay} · {categories[s.category]} · {s.unknown ? t('ungeklärt') : s.occupied ? t('belegt') : t('frei')}</option>)}</select></label>}
    {detailSpot && <SpotProperties spot={detailSpot}/>}
    <div className="parking-selection"><div><strong>{currentSelection ? `${t('Ausgewählt: ')}${currentSelection.level} · ${currentSelection.bay}` : t('Kein Stellplatz ausgewählt')}</strong><p>{savedPosition ? `${t('In deiner Parksession: ')}${savedPosition}` : matchingSession ? t('Noch keine Parkposition gespeichert.') : signedIn ? t('Speichern ist nur in einer aktiven Parksession dieses Parkhauses möglich.') : t('Zum Speichern ist eine Anmeldung und aktive Parksession erforderlich.')}</p></div><Button variant="outline" disabled={!ready || !matchingSession || !currentSelection} onClick={save}><Save/>{t('In Parksession speichern')}</Button></div>
    {savedPosition && <p className="section-subtitle">{t('Deine gespeicherte Position bleibt bis zum Abschluss der Parksession simuliert belegt. Keine echte Reservierung.')}</p>}
    {notice && <p role="status" className="parking-plan-notice">{notice}</p>}
    <div className="parking-simulation"><div><h3><Camera size={18}/>{t('KI-Kameraerkennung simulieren')}</h3><p>{t('Fiktive Belegungen · keine Kamera verbunden · keine Live-Verfügbarkeit')}</p></div><Button variant="secondary" onClick={() => simulate(facilityId)}><RefreshCw/>{t('Belegung simulieren')}</Button><label className="filter-switch"><input type="checkbox" checked={auto} onChange={e => setAuto(e.target.checked)}/>{t('Automatisch (alle 4 Sek.)')}</label><span className="section-subtitle" role="status">{plan.step ? `${plan.step} ${plan.step === 1 ? t('simulierte Aktualisierung') : t('simulierte Aktualisierungen')}` : t('Fiktiver Ausgangszustand')}</span></div>
    <details className="parking-camera-explanation"><summary>{t('Wie könnte echte Kameraerkennung funktionieren?')}</summary><p>{lang==='en'?'A real camera could deliver images of the marked parking spots. A computer vision model would detect vehicles and assign their position to the spot areas. Several consecutive images could confirm an occupancy. Shadows, poor lighting or obscured vehicles can cause errors; an uncertain occupancy would count as unknown. Real deployment would have to consider data protection, data minimisation and legal requirements.':'Eine echte Kamera könnte Bilder der markierten Stellplätze liefern. Ein Computer-Vision-Modell würde Fahrzeuge erkennen und ihre Position den Stellplatzflächen zuordnen. Mehrere aufeinanderfolgende Bilder könnten eine Belegung bestätigen. Schatten, schlechte Beleuchtung oder verdeckte Fahrzeuge können Fehler verursachen; eine unsichere Belegung würde als ungeklärt gelten. Ein realer Einsatz müsste Datenschutz, Datenminimierung und die rechtlichen Voraussetzungen berücksichtigen.'}</p><p>{lang==='en'?'Gender, family status or personal needs are not detected by a camera. Family, women\'s and accessible spots are predefined categories; users choose their needs themselves.':'Geschlecht, Familienstatus oder persönliche Bedürfnisse werden nicht durch eine Kamera erkannt. Familien-, Frauen- und barrierefreie Plätze sind vorab festgelegte Kategorien; Bedürfnisse wählt der Nutzer selbst.'}</p><p>{lang==='en'?'ParkPulse does not process camera images. Only simulated state changes affect the fictional spots here. The selection is not a reservation. The three demo levels and 48 spots per level are illustrative excerpts, not actual capacities. For open-air facilities, P1/P2/P3 are fictional plan areas, not building floors.':'ParkPulse verarbeitet keine Kamerabilder. Hier ändern ausschließlich simulierte Zustandswechsel die fiktiven Plätze. Die Auswahl ist keine Reservierung. Die drei Demo-Ebenen und 48 Plätze pro Ebene sind illustrative Ausschnitte, keine tatsächlichen Kapazitäten. Bei offenen Parkgeländen sind P1/P2/P3 fiktive Planbereiche, keine Gebäudegeschosse.'}</p></details>
  </section>;
}
