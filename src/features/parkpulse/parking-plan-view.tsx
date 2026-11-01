import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, Camera, Car, Check, Navigation, RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDemo } from './store';
import { parkingLevels, selectFreeSpot, savePlanPosition, type ParkingLevel, type ParkingPosition } from './parking-plan';
import { useParkingPlan } from './parking-plan-provider';

export function ParkingPlanView({ facilityId }: { facilityId: string }) {
  const { plans, simulate } = useParkingPlan();
  const { state, ready, signedIn, saveLocation } = useDemo();
  const [level, setLevel] = useState<ParkingLevel>('P1');
  const [selected, setSelected] = useState<ParkingPosition | null>(null);
  const [auto, setAuto] = useState(false);
  const [notice, setNotice] = useState('');
  const plan = plans[facilityId];
  useEffect(() => {
    if (!auto) return;
    const timer = setInterval(() => simulate(facilityId), 4000);
    return () => clearInterval(timer);
  }, [auto, facilityId, simulate]);
  useEffect(() => {
    if (selected && plan && !selectFreeSpot(plan.spots, selected)) {
      setSelected(null);
      setNotice('Der ausgewählte Stellplatz ist jetzt simuliert belegt. Bitte wähle einen freien Platz.');
    }
  }, [plan, selected]);
  if (!plan) return null;
  const visible = plan.spots.filter(s => s.level === level);
  const free = visible.filter(s => !s.occupied).length;
  const currentSelection = selected ? selectFreeSpot(plan.spots, selected) : null;
  const matchingSession = state.session?.facilityId === facilityId && state.session.status === 'active';
  const savedPosition = state.session?.facilityId === facilityId && state.session.level && state.session.bay
    ? `${state.session.level} · ${state.session.bay}` : null;
  const save = () => {
    if (!currentSelection || savePlanPosition(state, facilityId, plan.spots, currentSelection) === state) return;
    if (saveLocation(currentSelection.level, currentSelection.bay)) setNotice('Parkposition erfolgreich gespeichert.');
  };

  return <section className="parking-overview" aria-label="Demo-Stellplatzübersicht">
    <div className="section-heading"><div><p className="eyebrow">FIKTIVER PARKHAUSPLAN</p><h2>Deinen Stellplatz im Blick</h2></div><span className="ev-tag"><Camera size={14}/>Nur Simulation</span></div>
    <div className="parking-plan-toolbar">
      <div className="parking-levels" role="group" aria-label="Parkebene auswählen">{parkingLevels.map(floor => <Button key={floor} variant={level === floor ? 'default' : 'outline'} aria-pressed={level === floor} onClick={() => { setLevel(floor); setSelected(null); setNotice(''); }}>{floor}</Button>)}</div>
      <span className="parking-free-count">{free} frei · {24 - free} belegt <small>(fiktiv)</small></span>
    </div>
    <div className="parking-floor" aria-label={`Parkhausplan ${level}`}>
      <div className="parking-floor-label"><Navigation size={14}/><span>Einfahrt · {level}</span><span>Demo-Ausschnitt · 24 Plätze</span></div>
      {[0, 1].map(row => <div key={row}>
        {row === 1 && <div className="parking-aisle"><ArrowRight size={20}/><span>FAHRGASSE</span><ArrowRight size={20}/></div>}
        <div className="parking-spots">{visible.slice(row * 12, row * 12 + 12).map(spot => {
          const active = currentSelection?.level === spot.level && currentSelection.bay === spot.bay;
          return <Button key={spot.bay} variant="outline" className={`parking-spot ${spot.occupied ? 'is-occupied' : 'is-free'} ${active ? 'is-selected' : ''}`} disabled={spot.occupied} aria-label={`${spot.level} ${spot.bay} – ${spot.occupied ? 'belegt' : 'frei'}`} aria-pressed={active} onClick={() => { setSelected(selectFreeSpot(plan.spots, spot)); setNotice(''); }}>
            {spot.occupied ? <Car/> : active ? <Check/> : <span className="parking-spot-p">P</span>}<span>{spot.bay}</span>
          </Button>;
        })}</div>
      </div>)}
      <div className="parking-floor-exit"><ArrowDown size={14}/>Ausfahrt</div>
    </div>
    <div className="parking-plan-legend"><span><i className="spot-free-dot"/>Frei</span><span><Car size={14}/>Belegt</span><span><Check size={14}/>Ausgewählt</span></div>
    <div className="parking-selection"><div><strong>{currentSelection ? `Ausgewählt: ${currentSelection.level} · ${currentSelection.bay}` : 'Kein Stellplatz ausgewählt'}</strong><p>{savedPosition ? `In deiner Parksession: ${savedPosition}` : matchingSession ? 'Noch keine Parkposition gespeichert.' : signedIn ? 'Speichern ist nur in einer aktiven Parksession dieses Parkhauses möglich.' : 'Zum Speichern ist eine Anmeldung und aktive Parksession erforderlich.'}</p></div><Button variant="outline" disabled={!ready || !matchingSession || !currentSelection} onClick={save}><Save/>In Parksession speichern</Button></div>
    {notice && <p role="status" className="parking-plan-notice">{notice}</p>}
    <div className="parking-simulation"><div><h3><Camera size={18}/>KI-Kameraerkennung simulieren</h3><p>Fiktive Belegungen · keine Kamera verbunden · keine Live-Verfügbarkeit</p></div><Button variant="secondary" onClick={() => simulate(facilityId)}><RefreshCw/>Belegung simulieren</Button><label className="filter-switch"><input type="checkbox" checked={auto} onChange={e => setAuto(e.target.checked)}/>Automatisch (alle 4 Sek.)</label><span className="section-subtitle" role="status">{plan.step ? `${plan.step} simulierte Aktualisierung${plan.step === 1 ? '' : 'en'}` : 'Fiktiver Ausgangszustand'}</span></div>
    <details className="parking-camera-explanation"><summary>Wie könnte echte Kameraerkennung funktionieren?</summary><p>Eine echte Kamera könnte Bilder der markierten Stellplätze liefern. Ein Computer-Vision-Modell würde Fahrzeuge erkennen und ihre Position den Stellplatzflächen zuordnen. Mehrere aufeinanderfolgende Bilder könnten eine Belegung bestätigen. Schatten, schlechte Beleuchtung oder verdeckte Fahrzeuge können Fehler verursachen. Ein realer Einsatz müsste Datenschutz, Datenminimierung und die rechtlichen Voraussetzungen berücksichtigen.</p><p>ParkPulse verarbeitet keine Kamerabilder. Hier ändern ausschließlich simulierte Zustandswechsel die fiktiven Plätze. Die Auswahl ist keine Reservierung. Die drei Demo-Ebenen und 24 Plätze pro Ebene sind illustrative Ausschnitte, keine tatsächlichen Kapazitäten.</p></details>
  </section>;
}