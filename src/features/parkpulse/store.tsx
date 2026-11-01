import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { facilities, initialState, sessionCost, type DemoState } from './data';
const KEY = 'parkpulse-demo-v1';
type Store = { state: DemoState; ready: boolean; start: (id:string)=>void; stop: ()=>void; redeem: (id:string,cost:number)=>void; error:string };
const Context = createContext<Store | null>(null);
function validState(value: unknown): value is DemoState {
 if (!value || typeof value !== 'object') return false;
 const s=value as DemoState;
 return Number.isFinite(s.points) && s.points>=0 && Array.isArray(s.history) && s.history.every(h=>typeof h.id==='string' && facilities.some(p=>p.id===h.facilityId) && typeof h.date==='string' && Number.isFinite(h.minutes) && Number.isFinite(h.cost)) && Array.isArray(s.redeemed) && s.redeemed.every(r=>typeof r==='string') && (s.session===null || (typeof s.session==='object' && Number.isFinite(s.session.startedAt) && facilities.some(p=>p.id===s.session?.facilityId)));
}
export function DemoProvider({ children }: {children: ReactNode}) {
 const [state,setState]=useState<DemoState>(initialState); const [ready,setReady]=useState(false); const [error,setError]=useState('');
 useEffect(()=>{try {const raw=localStorage.getItem(KEY); if(raw){const value:unknown=JSON.parse(raw); if(validState(value))setState(value);}}catch{setError('Dein Browser kann die Demo-Daten nicht laden.');}setReady(true);},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(KEY,JSON.stringify(state));}catch{setError('Lokales Speichern ist nicht verfügbar. Daten bleiben nur bis zum Neuladen erhalten.');}},[state,ready]);
 const start=(id:string)=>{if(!ready || !facilities.some(p=>p.id===id))return; setState(s=>s.session?s:{...s,session:{facilityId:id,startedAt:Date.now()}});};
 const stop=()=>{if(!ready)return;setState(s=>{if(!s.session)return s; const facility=facilities.find(p=>p.id===s.session?.facilityId); if(!facility)return s;const now=Date.now();return {...s,session:null,points:s.points+25,history:[{id:`session-${now}`,facilityId:facility.id,date:new Date(now).toISOString(),minutes:Math.max(1,Math.ceil((now-s.session.startedAt)/60000)),cost:sessionCost(s.session.startedAt,now,facility.price)},...s.history]};});};
 const redeem=(id:string,cost:number)=>{if(!ready)return;setState(s=>s.points<cost||s.redeemed.includes(id)?s:{...s,points:s.points-cost,redeemed:[...s.redeemed,id]});};
 return <Context.Provider value={{state,ready,start,stop,redeem,error}}>{children}</Context.Provider>;
}
export function useDemo(){const ctx=useContext(Context);if(!ctx)throw new Error('ParkPulse provider missing');return ctx;}
