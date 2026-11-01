import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Camera, Car, Check, Navigation, RefreshCw, Save, CircleHelp } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useDemo } from './store';
import { parkingLevels, spotsPerLevel, occupancyStats, selectFreeSpot, savePlanPosition, matchesSpot, defaultFilters, categoryLabels, type ParkingLevel, type ParkingPosition } from './parking-plan';
import { ParkingFiltersView, SpotProperties, FilterReset, categoryIcons, shortCategories } from './parking-filters';
import { facilities } from './data';
import { useParkingPlan } from './parking-plan-provider';

export function ParkingPlanView({ facilityId }: { facilityId: string }) {
  const { plans, simulate } = useParkingPlan();
  const { state, ready, signedIn, saveLocation } = useDemo();
  const [level, setLevel] = useState<ParkingLevel>('P1');
  const [selected, setSelected] = useState<ParkingPosition | null>(null);
  const [auto, setAuto] = useState(false);
  const [notice, setNotice] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [inspected, setInspected] = useState('');
  const plan = plans[facilityId];
  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(() => simulate(facilityId), 4000);
    return () => clearInterval(timer);
  }, [auto, facilityId, simulate]);
  useEffect(() => {
    if (selected && plan && !selectFreeSpot(plan.spots, selected, filters)) {
      setSelected(null);
      setNotice('Der ausgewählte Stellplatz ist nicht mehr frei oder passt nicht zu deinen Kriterien. Bitte wähle erneut.');
    }
  }, [plan, selected, filters]);
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
    if (saveLocation(currentSelection.level, currentSelection.bay)) setNotice('Parkposition erfolgreich gespeichert.');
  };

  return <section className="parking-overview" aria-label="Demo-Stellplatzübersicht">
    <div className="section-heading"><div><p className="eyebrow">FIKTIVER PARKHAUSPLAN</p><h2>Deinen Stellplatz im Blick</h2></div><span className="ev-tag"><Camera size={14}/>Nur Simulation</span></div>
    <div className="parking-occupancy-summary" aria-label="Gesamtbelegung aller Demo-Ebenen" role="status"><span><strong>{totals.total}</strong>Gesamtzahl</span><span><strong>{totals.free}</strong>Frei</span><span><strong>{totals.occupied}</strong>Belegt</span><span><strong>{totals.unknown}</strong>Ungeklärt</span><span><strong>{totals.percent} %</strong>Auslastung</span></div><p className="section-subtitle">Alle drei Demo-Ebenen · unabhängig vom Fahrzeugfilter · ausschließlich simuliert</p>
    <ParkingFiltersView filters={filters} onChange={next => { setFilters(next); setInspected(''); }}/>
    <div className="parking-plan-toolbar">
      <div className="parking-levels" role="group" aria-label="Parkebene auswählen">{parkingLevels.map(floor => <Button key={floor} variant={level === floor ? 'default' : 'outline'} aria-pressed={level === floor} onClick={() => { setLevel(floor); setSelected(null); setNotice(''); }}>{floor}</Button>)}</div>
      <span className="parking-free-count">{free} frei · {matching.length - free - unknown} belegt · {unknown} ungeklärt <small>(passend · fiktiv)</small></span>
    </div>
    <div className="parking-floor" aria-label={`Parkhausplan ${level}`}>
      <div className="parking-floor-label"><Navigation size={14}/><span>Einfahrt · {level}</span><span>{spotsPerLevel} Demo-Plätze · {floorTotals.free} frei · {floorTotals.occupied} belegt · {floorTotals.percent} % Auslastung</span></div>
      {[0, 1, 2, 3].map(row => <div key={row}>
        {row % 2 === 1 && <div className="parking-aisle"><ArrowRight size={20}/><span>FAHRGASSE</span><ArrowRight size={20}/></div>}
        <div className="parking-spots">{visible.slice(row * 12, row * 12 + 12).map(spot => {
          if (!matchesSpot(spot, filters)) return <div key={spot.bay} className="parking-spot-hidden" aria-hidden="true"/>;
          const active = currentSelection?.level === spot.level && currentSelection.bay === spot.bay;
          const Icon = categoryIcons[spot.category];
          const status = spot.unknown ? 'ungeklärt' : spot.occupied ? 'belegt' : 'frei';
          return <Button key={spot.bay} variant="outline" title={`${categoryLabels[spot.category]} · ${spot.length} × ${spot.width} m · max. ${spot.maxWeight} kg · ${spot.maxHeight ?? 'unbegrenzte'} m Höhe · ${spot.exitDistance} m zum ${spot.exitType}`} className={`parking-spot ${spot.unknown ? 'is-unknown' : spot.occupied ? 'is-occupied' : 'is-free'} ${active ? 'is-selected' : ''}`} disabled={spot.occupied || spot.unknown} aria-label={`${spot.level} ${spot.bay} – ${status} – ${categoryLabels[spot.category]}`} aria-pressed={active} onClick={() => { setSelected(selectFreeSpot(plan.spots, spot, filters)); setInspected(''); setNotice(''); }}>
            {spot.unknown ? <CircleHelp/> : spot.occupied ? <Car/> : active ? <Check/> : <Icon/>}<span>{spot.bay}</span><small>{shortCategories[spot.category]}</small>
          </Button>;
        })}</div>
      </div>)}
      <div className="parking-floor-exit"><ArrowDown size={14}/>Ausfahrt</div>
    </div>
    <div className="parking-plan-legend"><span><i className="spot-free-dot"/>Frei</span><span><Car size={14}/>Belegt</span><span><CircleHelp size={14}/>Ungeklärt</span><span><Check size={14}/>Ausgewählt</span></div>
    {free === 0 && <div className="parking-no-match" role="status"><strong>Keine passenden freien Stellplätze auf {level}.</strong><p>{matching.length ? 'Passende Plätze sind belegt oder ihre Belegung ist ungeklärt.' : 'Die Stellplätze passen nicht zu deinem Fahrzeug oder den gewählten Bedürfnissen.'} Fahrzeuggrenzen werden nicht gelockert.</p><div>{otherLevels.map(floor => <Button key={floor} variant="outline" onClick={() => { setLevel(floor); setSelected(null); setInspected(''); }}>Freie Plätze auf {floor}</Button>)}<FilterReset onReset={() => setFilters({ ...filters, needs: { wallbox: false, family: false, women: false, accessible: false } })}/></div>{alternatives.length > 0 && <p>Andere fiktive Parkgelände mit passenden freien Plätzen: {alternatives.map(p => <Link key={p.id} to="/parkplatz/$id" params={{ id: p.id }} className="parking-alternative">{p.name}</Link>)}<br/>Bitte Fahrzeug und Bedürfnisse dort erneut einstellen.</p>}</div>}
    {matching.length > 0 && <label className="parking-inspect">Stellplatzdetails (auch belegt / ungeklärt)<select value={inspected} onChange={e => setInspected(e.target.value)}><option value="">Stellplatz ansehen</option>{matching.map(s => <option key={s.bay} value={s.bay}>{s.bay} · {categoryLabels[s.category]} · {s.unknown ? 'ungeklärt' : s.occupied ? 'belegt' : 'frei'}</option>)}</select></label>}
    {detailSpot && <SpotProperties spot={detailSpot}/>}
    <div className="parking-selection"><div><strong>{currentSelection ? `Ausgewählt: ${currentSelection.level} · ${currentSelection.bay}` : 'Kein Stellplatz ausgewählt'}</strong><p>{savedPosition ? `In deiner Parksession: ${savedPosition}` : matchingSession ? 'Noch keine Parkposition gespeichert.' : signedIn ? 'Speichern ist nur in einer aktiven Parksession dieses Parkhauses möglich.' : 'Zum Speichern ist eine Anmeldung und aktive Parksession erforderlich.'}</p></div><Button variant="outline" disabled={!ready || !matchingSession || !currentSelection} onClick={save}><Save/>In Parksession speichern</Button></div>
    {savedPosition && <p className="section-subtitle">Deine gespeicherte Position bleibt bis zum Abschluss der Parksession simuliert belegt. Keine echte Reservierung.</p>}
    {notice && <p role="status" className="parking-plan-notice">{notice}</p>}
    <div className="parking-simulation"><div><h3><Camera size={18}/>KI-Kameraerkennung simulieren</h3><p>Fiktive Belegungen · keine Kamera verbunden · keine Live-Verfügbarkeit</p></div><Button variant="secondary" onClick={() => simulate(facilityId)}><RefreshCw/>Belegung simulieren</Button><label className="filter-switch"><input type="checkbox" checked={auto} onChange={e => setAuto(e.target.checked)}/>Automatisch (alle 4 Sek.)</label><span className="section-subtitle" role="status">{plan.step ? `${plan.step} simulierte Aktualisierung${plan.step === 1 ? '' : 'en'}` : 'Fiktiver Ausgangszustand'}</span></div>
    <details className="parking-camera-explanation"><summary>Wie könnte echte Kameraerkennung funktionieren?</summary><p>Eine echte Kamera könnte Bilder der markierten Stellplätze liefern. Ein Computer-Vision-Modell würde Fahrzeuge erkennen und ihre Position den Stellplatzflächen zuordnen. Mehrere aufeinanderfolgende Bilder könnten eine Belegung bestätigen. Schatten, schlechte Beleuchtung oder verdeckte Fahrzeuge können Fehler verursachen; eine unsichere Belegung würde als ungeklärt gelten. Ein realer Einsatz müsste Datenschutz, Datenminimierung und die rechtlichen Voraussetzungen berücksichtigen.</p><p>Geschlecht, Familienstatus oder persönliche Bedürfnisse werden nicht durch eine Kamera erkannt. Familien-, Frauen- und barrierefreie Plätze sind vorab festgelegte Kategorien; Bedürfnisse wählt der Nutzer selbst.</p><p>ParkPulse verarbeitet keine Kamerabilder. Hier ändern ausschließlich simulierte Zustandswechsel die fiktiven Plätze. Die Auswahl ist keine Reservierung. Die drei Demo-Ebenen und 48 Plätze pro Ebene sind illustrative Ausschnitte, keine tatsächlichen Kapazitäten. Bei offenen Parkgeländen sind P1/P2/P3 fiktive Planbereiche, keine Gebäudegeschosse.</p></details>
  </section>;
}