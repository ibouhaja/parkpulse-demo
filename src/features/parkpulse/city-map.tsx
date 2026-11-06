import { tariffs } from './tariffs';
import { bonusFor } from './map-rules';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus,Minus,Navigation,Zap,Gift,Tag } from 'lucide-react';
import { facilityOffers,facilityAvailability } from './map-rules';
import { type Facility,money } from './data';
import { type ParkingFilters,type ParkingSpot } from './parking-plan';
import { useI18n } from './i18n';

const positions:Record<string,[number,number]>={quartier:[53,45],ufer:[81,34],stadtgarten:[50,80],werk:[16,51],markt:[25,33],nord:[80,77]};
export function CityMap({items,plans,filters,selected,onSelect,route=false}:{items:Facility[];plans:Record<string,{spots:ParkingSpot[]}>;filters:ParkingFilters;selected:string|null;onSelect:(id:string)=>void;route?:boolean}){
 const [zoom,setZoom]=useState(1);
 const {t,lang,locale}=useI18n();
 return <div className="city-map" aria-label={t('Fiktive Parkplatzkarte')}>
 <div className="city-map-surface" style={{transform:`scale(${zoom})`}}>
 <svg viewBox="0 0 1000 720" preserveAspectRatio="none" role="img" aria-label={t('Stilisierte Karte von Demostadt')}><rect width="1000" height="720" className="city-land"/><path className="city-water" d="M730-20C550 190 830 300 620 430S690 610 560 740H670C750 600 700 530 730 440S900 240 805-20Z"/><path className="city-park" d="M35 520h260v130H35zM270 340h180v145H270zM820 35h160v140H820z"/><g className="city-buildings">{Array.from({length:42},(_,i)=><rect key={i} x={32+(i%7)*138} y={30+Math.floor(i/7)*115} width={70+(i%3)*10} height={50+(i%2)*18} rx="5"/>)}</g><g className="city-streets"><path d="M0 120H1000M0 290H1000M0 530H1000M170 0V720M480 0V720M900 0V720M0 670L620 0M0 390L1000 620"/></g><g className="city-labels"><text x="310" y="90">ALTSTADT</text><text x="670" y="155">HAFENVIERTEL</text><text x="290" y="460">STADTGARTEN</text><text x="35" y="340">WESTEND</text><text x="735" y="660">NORDVIERTEL</text></g>{route&&selected&&<path className="city-route" d={`M365 410 L480 410 L480 ${(positions[selected]?.[1]??32)*7.2} L${(positions[selected]?.[0]??53)*10} ${(positions[selected]?.[1]??32)*7.2}`}/>}</svg>
 {items.map(p=>{const pos=positions[p.id]??[50,50];const a=facilityAvailability(plans[p.id]?.spots??[],filters);return <Button key={p.id} variant="outline" className={`city-marker ${selected===p.id?'is-active':''}`} style={{left:`${pos[0]}%`,top:`${pos[1]}%`}} onClick={()=>onSelect(p.id)} aria-label={`${p.name}: ${money(p.price,lang)} ${t('pro Stunde')}, ${a.matching} ${t('passende freie Plätze')}, +${bonusFor(p.id)} ${t('mögliche Punkte')}, ${tariffs[p.id]?.offer??""}`} aria-pressed={selected===p.id}><strong>{money(p.price,lang)}<small>/ h</small></strong><span>{a.matching} {t('frei')} {p.ev>0&&<Zap size={11}/>} · <Gift size={10}/> +{bonusFor(p.id).toLocaleString(locale)}{facilityOffers[p.id]?.shopping&&<Tag size={10}/>}</span><small className="marker-offer">{t(tariffs[p.id]?.offer??'')}</small></Button>;})}
 <span className="city-origin"><Navigation size={18}/></span></div>
 <div className="city-map-tools"><Button variant="outline" size="icon" aria-label={t('Karte vergrößern')} onClick={()=>setZoom(z=>Math.min(1.5,z+.15))}><Plus/></Button><Button variant="outline" size="icon" aria-label={t('Karte verkleinern')} onClick={()=>setZoom(z=>Math.max(1,z-.15))}><Minus/></Button></div>
 <span className="city-map-credit">{t('Demostadt · fiktive Karte und Verfügbarkeit')}</span>
 </div>;
}
