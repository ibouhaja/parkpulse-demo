import { preferencesFilters } from './preferences';
import { tariffs, tariffDescription } from './tariffs';
import { earnedPoints } from './points';
import { useState,useEffect } from 'react';
import { Link,useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { Search,Zap,Users,Accessibility,Car,Tag,Gift,MapPin,Clock,ArrowRight,ChevronUp,ChevronDown,X,Navigation,Check,CalendarDays,SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { facilities,money } from './data';
import { defaultFilters,vehicleDefaults,vehicleLabels, type VehicleType, matchesSpot } from './parking-plan';
import { useParkingPlan } from './parking-plan-provider';
import { useDemo } from './store';
import { useReservations } from './reservations-provider';
import { bookReservation } from './reservations.functions';
import { bonusFor,facilityOffers,facilityAvailability,mapFacilities,reservationPrice } from './map-rules';
import { CityMap } from './city-map';
import type { Reservation } from './reservation-rules';
import { CancellationTerms, CancelReservationButton } from './cancellation-ui';

export function MapHome(){
 const {plans,simulate}=useParkingPlan();const {state,signedIn,arrive,preferences,userId,profileReady}=useDemo();const {reservations,refresh,available}=useReservations();
 const book=useServerFn(bookReservation);const navigate=useNavigate();
 const [filterState,setFilters]=useState<{owner:string|null;value:typeof defaultFilters}>({owner:null,value:defaultFilters});
 const accountFilters=signedIn&&profileReady?preferencesFilters(preferences):defaultFilters;
 const filters=filterState.owner===userId?filterState.value:accountFilters;
 const updateFilters=(next:typeof defaultFilters|((f:typeof defaultFilters)=>typeof defaultFilters))=>setFilters({owner:userId,value:typeof next==='function'?next(filters):next});
 useEffect(()=>{setFilters({owner:userId,value:accountFilters});},[userId,preferences,profileReady]);const [query,setQuery]=useState('');const [min20,setMin20]=useState(false);const [shopping,setShopping]=useState(false);const [cheapest,setCheapest]=useState(false);const [vehicleOpen,setVehicleOpen]=useState(false);
 const [selected,setSelected]=useState<string|null>('quartier');const [expanded,setExpanded]=useState(false);const [booking,setBooking]=useState(false);const [position,setPosition]=useState('');const [date,setDate]=useState('');const [time,setTime]=useState('');const [hours,setHours]=useState(2);const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);const [routeId,setRouteId]=useState<string|null>(null);
 useEffect(()=>{const d=new Date(Date.now()+3600000);const local=new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString();setDate(local.slice(0,10));setTime(local.slice(11,16));},[]);
 const items=signedIn&&!profileReady?[]:mapFacilities(plans,filters,query,min20,shopping,cheapest);const p=items.find(p=>p.id===selected);const a=p?facilityAvailability(plans[p.id]?.spots??[],filters):null;
 const offer=p?facilityOffers[p.id]:null;const activeBookings=reservations.filter(r=>r.status==='booked'||r.status==='arrived');const routed=reservations.find(r=>r.id===routeId);
 const spots=p?(plans[p.id]?.spots??[]).filter(s=>!s.occupied&&!s.unknown&&matchesSpot(s,filters)):[];
 const plannedStart=Date.parse(`${date}T${time}`);const price=p?reservationPrice(hours,p.id,Number.isFinite(plannedStart)?plannedStart:Date.now()):null;const potential=shopping&&!state.shop2Used&&offer?.shopping?Math.min(2,price??0):0;
 const select=(id:string)=>{setSelected(id);setBooking(false);setPosition('');setMessage('');};
 const need=(key:keyof typeof filters.needs)=>updateFilters(f=>({...f,needs:{...f.needs,[key]:!f.needs[key]}}));
 const run=async(fn:()=>Promise<void>)=>{if(busy)return;setBusy(true);setMessage('');try{await fn();}catch(e){setMessage(e instanceof Error?e.message:'Die Aktion konnte nicht gespeichert werden.');}finally{setBusy(false);}};
 const showRoute=(r:Reservation)=>{setRouteId(r.id);setSelected(r.facility_id);setQuery('');updateFilters(defaultFilters);setMin20(false);setShopping(false);setCheapest(false);setBooking(false);};
 return <section className="map-home">
 <header className="map-home-heading"><div><span className="eyebrow">DEMOSTADT · DEIN NÄCHSTES ZIEL</span><h1>ParkPulse<span>.</span></h1><p>Dein Platz. Dein Preis. Dein nächster Bonus.</p></div><Button asChild variant="outline"><Link to="/reservierungen"><CalendarDays/>Meine Reservierungen{activeBookings.length>0&&<span>{activeBookings.length}</span>}</Link></Button></header>
 <div className="map-experience">
 <div className="map-search-controls"><label className="map-search"><Search size={19}/><input aria-label="Parkhaus oder Stadtteil suchen" placeholder="Wohin möchtest du?" value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<Button variant="ghost" size="icon" aria-label="Suche löschen" onClick={()=>setQuery('')}><X/></Button>}<span>Demostadt</span></label>
 <div className="map-filter-chips" aria-label="Parkhausfilter">
 <Button variant={min20?'default':'outline'} aria-pressed={min20} onClick={()=>setMin20(!min20)}>20+ frei</Button>
 <Button variant={filters.needs.wallbox?'default':'outline'} aria-pressed={filters.needs.wallbox} onClick={()=>need('wallbox')}><Zap/>Wallbox</Button>
 <Button variant={filters.needs.women?'default':'outline'} aria-pressed={filters.needs.women} onClick={()=>need('women')}><Users/>Frauenparkplatz</Button>
 <Button variant={filters.needs.family?'default':'outline'} aria-pressed={filters.needs.family} onClick={()=>need('family')}><Users/>Familie</Button>
 <Button variant={filters.needs.accessible?'default':'outline'} aria-pressed={filters.needs.accessible} onClick={()=>need('accessible')}><Accessibility/>Barrierefrei</Button>
 <Button variant={vehicleOpen?'default':'outline'} aria-expanded={vehicleOpen} onClick={()=>setVehicleOpen(!vehicleOpen)}><Car/>Fahrzeug / Höhe</Button>
 <Button variant={cheapest?'default':'outline'} aria-pressed={cheapest} onClick={()=>setCheapest(!cheapest)}>Günstigster Preis</Button>
 <Button variant={shopping?'default':'outline'} aria-pressed={shopping} onClick={()=>setShopping(!shopping)}><Tag/>Shopping</Button>
 </div>
 {vehicleOpen&&<div className="map-vehicle-options"><label>Fahrzeugtyp<select value={filters.vehicle} onChange={e=>{const v=e.target.value as VehicleType;updateFilters(f=>({...f,vehicle:v,...vehicleDefaults[v]}));}}>{Object.entries(vehicleLabels).map(([v,label])=><option key={v} value={v}>{label}</option>)}</select></label><label>Fahrzeughöhe (m)<input type="number" min="0.1" max="5" step="0.05" value={filters.height} onChange={e=>updateFilters(f=>({...f,height:Number(e.target.value)}))}/></label></div>}
 </div>
 <CityMap items={items} plans={plans} filters={filters} selected={p?.id??null} onSelect={select} route={!!routed}/>
 <div className="map-results-badge"><span className="status-dot"/>{items.length} Parkmöglichkeiten · passende freie Plätze{cheapest&&<small>Nach Stundentarif sortiert</small>}</div>
 <Button className="map-simulate" variant="outline" size="sm" onClick={()=>facilities.forEach(p=>simulate(p.id))}><SlidersHorizontal/>Belegung simulieren</Button>
 {!items.length&&(!signedIn||profileReady)&&<div className="map-empty"><Search/><h2>Kein passender freier Stellplatz</h2><p>Probiere andere Bedürfnisse oder ein kleineres Fahrzeug.</p><Button onClick={()=>{updateFilters(defaultFilters);setMin20(false);setShopping(false);setQuery('');}}>Filter zurücksetzen</Button></div>}
 {p&&a&&<aside className={`facility-sheet ${expanded?'is-expanded':''}`} aria-label="Parkhaus-Detailkarte">
 <Button variant="ghost" className="sheet-handle" aria-label={expanded?'Details einklappen':'Details ausklappen'} onClick={()=>setExpanded(!expanded)}>{expanded?<ChevronDown/>:<ChevronUp/>}</Button>
 <div className="sheet-scroll"><div className="sheet-title"><div className="sheet-parking">P</div><div><h2>{p.name}</h2><p><MapPin size={12}/>{p.address}</p></div><Button variant="ghost" size="icon" aria-label="Parkhausdetails schließen" onClick={()=>{setSelected(null);setBooking(false);}}><X/></Button></div>
 <div className="sheet-primary-facts"><div><strong>{money(p.price)}<small> / h</small></strong><span>Je angefangene Stunde</span></div><div><strong>{a.matching}<small> frei</small></strong><span>{a.free} frei / {a.total} gesamt</span></div><div><strong>{bonusFor(p.id)}<small> Punkte</small></strong><span>Beispiel: 2 h tagsüber, ohne Rabatt</span></div></div>
 <div className="sheet-walk"><Navigation size={14}/>{p.distance.toLocaleString('de-DE')} km · ca. {Math.ceil(p.distance*12)} Min. zu Fuß <span>simuliert</span></div>
 {(expanded||booking)&&<><div className="sheet-capabilities"><span><Zap/>{a.wallbox} Wallboxen frei</span><span><Users/>{a.women} Frauenplätze frei</span><span><Users/>{a.family} Familienplätze frei</span><span><Accessibility/>{a.accessible} barrierefrei</span></div><div className="sheet-extra"><span><Clock/>{offer?.hours} · fiktiv</span><span>{tariffDescription(tariffs[p.id]??{version:0,hourlyCents:200,firstHourCents:200,eveningCents:200,dailyCapCents:4800,shoppingCents:0,promotionPoints:0,referencePoints:0,offer:"Bestandstarif"})}</span><span>{offer?.shopping||'Keine Shopping-Aktion an diesem Standort'}</span></div><p className="sheet-reward-note"><Gift size={18}/> Bis zu {bonusFor(p.id).toLocaleString("de-DE")} ParkPulse-Punkte sichern: Beispiel 2 h tagsüber ohne Rabatt. Tatsächliche Punkte nach Dauer und Zahlbetrag; keine Punkte bei Gutschein-Einlösung. {tariffs[p.id]?.offer} · Shopping-Rabatt bis {money((tariffs[p.id]?.shoppingCents??0)/100)}.</p></>}
 {booking?<form className="reservation-form" onSubmit={e=>{e.preventDefault();void run(async()=>{const [level,bay]=position.split(':');if(!level||!bay||price===null)throw new Error('Bitte wähle einen freien Stellplatz und eine gültige Parkdauer.');const start=new Date(`${date}T${time}`);if(!Number.isFinite(start.getTime()))throw new Error('Bitte wähle Datum und Uhrzeit.');const id=crypto.randomUUID();await book({data:{id,facility:p.id,level,bay,startsAt:start.toISOString(),hours,filters,step:plans[p.id]?.step??0}});await refresh();setBooking(false);setRouteId(id);setMessage(`Demo-Reservierung bestätigt: PP-${id.slice(0,8).toUpperCase()}`);});}}>
 <h3>Deine Demo-Reservierung</h3><label>Freier, geeigneter Stellplatz<select aria-label="Reservierter Stellplatz" required value={position} onChange={e=>setPosition(e.target.value)}><option value="">Stellplatz wählen</option>{spots.map(s=><option key={`${s.level}:${s.bay}`} value={`${s.level}:${s.bay}`}>{s.level} · {s.bay}{s.charging?` · ${s.charging.power} kW`:''}</option>)}</select></label>
 <div className="reservation-date"><label>Datum<input aria-label="Reservierungsdatum" type="date" required value={date} onChange={e=>setDate(e.target.value)}/></label><label>Uhrzeit<input aria-label="Reservierungsuhrzeit" type="time" required value={time} onChange={e=>setTime(e.target.value)}/></label></div><label>Geplante Parkdauer (Stunden)<input aria-label="Geplante Parkdauer" type="number" min="0.5" max="72" step="0.5" required value={hours} onChange={e=>setHours(Number(e.target.value))}/></label>
 <div className="booking-line"><span>Geschätzter Parkpreis</span><strong>{money(price??0)}</strong></div><div className="booking-line"><span>Möglicher SHOP2-Rabatt</span><strong>bis −{money(potential)}</strong></div><div className="booking-line"><span>Mit möglichem Rabatt</span><strong>{money((price??0)-potential)}</strong></div><p>Rabatte und Gutscheine erst im Checkout anwenden. Die tatsächliche Demo-Dauer bestimmt den Endpreis. {earnedPoints((price??0)-potential,false,tariffs[p.id]).total} mögliche Punkte bei geplanter Dauer mit diesem Rabatt. Ein Stempel bei positiv bezahltem Abschluss. Der Stellplatz bleibt bis Stornierung oder Abschluss simuliert gehalten.</p><CancellationTerms/><Button type="submit" disabled={busy||!available}>{busy?'Wird gespeichert …':'Demo-Reservierung bestätigen'}<Check/></Button><Button variant="ghost" type="button" onClick={()=>setBooking(false)}>Abbrechen</Button></form>:<div className="sheet-actions">{signedIn?<Button disabled={!available} onClick={()=>{setBooking(true);setExpanded(true);setPosition('');}}>Parkplatz reservieren<ArrowRight/></Button>:<Button asChild><Link to="/auth" search={{redirect:'/'}}>Anmelden & demo-reservieren<ArrowRight/></Link></Button>}<Button asChild variant="outline"><Link to="/parkplatz/$id" params={{id:p.id}}>Parkhausplan ansehen</Link></Button></div>}
 {message&&<p role="status" className="reservation-message">{message}</p>}
 </div></aside>}
 </div>
 {routed&&<div className="demo-route-panel"><div><span className="eyebrow">ROUTE · SIMULATION</span><h2>{facilities.find(p=>p.id===routed.facility_id)?.name}</h2><p>{facilities.find(p=>p.id===routed.facility_id)?.distance} km · ca. 8 Min. Fahrt · Ankunft ca. 8 Min. nach Demo-Start. Keine GPS-Navigation.</p></div><Button disabled={busy||routed.status!=='booked'||!!state.session} onClick={()=>void run(async()=>{await arrive(routed.id);await refresh();await navigate({to:'/parksession'});})}>Ankunft simulieren<Navigation/></Button>{state.session&&<Link to="/parksession" className="text-primary text-xs">Bestehende Parksession zuerst abschließen</Link>}</div>}
 <div className="map-nearby"><div className="section-heading"><h2>Parken in Demostadt</h2><span>{items.length} Ergebnisse</span></div><div className="map-facility-list">{items.map(p=>{const a=facilityAvailability(plans[p.id]?.spots??[],filters);return <Button variant="outline" className="map-facility-item" key={p.id} onClick={()=>{select(p.id);window.scrollTo({top:0,behavior:'smooth'});}}><span className="sheet-parking">P</span><span><strong>{p.name}</strong><small>{a.matching} passend frei · {bonusFor(p.id)} Bonuspunkte</small></span><b>{money(p.price)}<small>/ h</small></b></Button>;})}</div></div>
 {activeBookings.length>0&&<section className="map-bookings"><h2>Deine Demo-Reservierungen</h2>{activeBookings.map(r=><article className="reservation-row" key={r.id}><div><strong>{facilities.find(p=>p.id===r.facility_id)?.name}</strong><p>PP-{r.id.slice(0,8).toUpperCase()} · {r.level}/{r.bay} · {new Date(r.starts_at).toLocaleString('de-DE')} · {r.hours} h</p><small>{r.status==='arrived'?'Ankunft simuliert · Parksession läuft':'Reserviert · nur Demo'}</small></div><div><Button variant="outline" onClick={()=>showRoute(r)}>Route anzeigen<Navigation/></Button>{r.status==='booked'&&<CancelReservationButton id={r.id} disabled={busy} onCancelled={()=>{if(routeId===r.id)setRouteId(null);}}/>}</div></article>)}</section>}
 {!available&&<p role="status" className="text-muted-foreground text-xs mt-3">Reservierungskapazität wird geladen. Buchungen sind bis zur Prüfung gesperrt.</p>}
 </section>;
}