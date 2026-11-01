import { createFileRoute } from '@tanstack/react-router';
import { Gift, Coffee, CircleParking, Zap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { rewards } from '@/features/parkpulse/data';
import { useDemo } from '@/features/parkpulse/store';
import { PageHeading, pageHead } from '@/features/parkpulse/shared';
export const Route=createFileRoute('/praemien')({head:()=>pageHead('Pulse Rewards','Fiktive Pulse Points sammeln und virtuelle Demo-Prämien entdecken.'),component:Rewards});
function Rewards(){const {state,redeem,ready}=useDemo();return <><PageHeading title="Kleine Wege. Schöne Extras." subtitle="Für jede beendete Demo-Parksession erhältst du 25 Pulse Points. Prämien sind rein virtuell." eyebrow="PULSE REWARDS"/><div className="reward-total"><div><span className="reward-label">DEIN PUNKTESTAND</span><h2>{state.points} Pulse Points</h2><p>Nur in diesem Browser · keine echten Gutscheine</p></div><Gift size={44}/></div><div className="rewards-grid">{rewards.map(r=>{const done=state.redeemed.includes(r.id);const Icon=r.icon==='coffee'?Coffee:r.icon==='charge'?Zap:CircleParking;return <article className="reward-card" key={r.id}><Icon size={32}/><h3>{r.name}</h3><p>{r.description}</p><strong>{r.cost} Pulse Points</strong><Button disabled={!ready||done||state.points<r.cost} variant={done?'secondary':'default'} onClick={()=>redeem(r.id,r.cost)}>{done?<><Check/>Eingelöst (Demo)</>:state.points<r.cost?`Noch ${r.cost-state.points} Punkte`:'Virtuell einlösen'}</Button></article>;})}</div></>;}
