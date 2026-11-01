import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { initialState, type DemoState } from './data';
import { restoreState, STORAGE_KEY, transition, type Action } from './session';
type Store = { state: DemoState; ready: boolean; start: (id:string)=>boolean; end: ()=>boolean; complete: ()=>boolean; advance:(hours:1|3)=>void; saveLocation:(level:string,bay:string)=>boolean; redeem: (id:string,cost:number)=>void; error:string };
const Context=createContext<Store|null>(null);
export function DemoProvider({children}:{children:ReactNode}) {
 const [state,setState]=useState(initialState); const current=useRef(initialState);const [ready,setReady]=useState(false);const [error,setError]=useState('');const loaded=useRef(false);
 useEffect(()=>{
  try {const s=restoreState(localStorage.getItem(STORAGE_KEY));current.current=s;setState(s);loaded.current=true;setReady(true);}catch{setError('Die gespeicherten Demo-Daten konnten nicht geladen werden. Sie werden nicht überschrieben.');}
  const sync=(event:StorageEvent)=>{if(event.key===STORAGE_KEY)try{const s=restoreState(event.newValue);current.current=s;setState(s);}catch{setError('Die gespeicherten Demo-Daten konnten nicht geladen werden.');}};
  window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);
 },[]);
 const commit=(action:Action)=>{
  if(!loaded.current)return false;
  try {
   const raw=localStorage.getItem(STORAGE_KEY);
   const latest=raw?restoreState(raw):current.current;
   const next=transition(latest,action);
   localStorage.setItem(STORAGE_KEY,JSON.stringify(next));
   current.current=next;setState(next);setError('');return true;
  }catch{setError('Speichern ist nicht möglich. Der Parkvorgang wurde nicht verändert. Bitte erlaube lokalen Browserspeicher.');return false;}
 };
 const start=(facilityId:string)=>commit({type:'start',facilityId,id:crypto.randomUUID(),now:Date.now()});
 const end=()=>commit({type:'end',now:Date.now()});
 const complete=()=>commit({type:'complete'});
 const advance=(hours:1|3)=>{commit({type:'advance',hours,now:Date.now()});};
 const saveLocation=(level:string,bay:string)=>commit({type:'location',level,bay});
 const redeem=(id:string,cost:number)=>{commit({type:'redeem',id,cost});};
 return <Context.Provider value={{state,ready,start,end,complete,advance,saveLocation,redeem,error}}>{children}</Context.Provider>;
}
export function useDemo(){const ctx=useContext(Context);if(!ctx)throw new Error('ParkPulse-Demo ist nicht verfügbar');return ctx;}
