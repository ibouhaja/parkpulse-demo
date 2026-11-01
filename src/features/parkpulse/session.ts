import { facilities, initialState, sessionCost, type DemoState, type Session } from './data';
export const STORAGE_KEY = 'parkpulse-demo-v1';
export function elapsedMs(session: Session, now: number) {
 return session.status === 'checkout-pending' ? session.finalDurationMs ?? 0 : Math.max(0, Math.max(now + session.demoOffsetMs, session.effectiveDemoTime) - session.startedAt);
}
export function durationText(ms: number) {
 const secs = Math.floor(ms / 1000);
 return [Math.floor(secs / 3600), Math.floor(secs / 60) % 60, secs % 60].map(n => String(n).padStart(2, '0')).join(':');
}
export type Action = { type: 'start'; facilityId: string; id: string; now: number } | { type: 'advance'; hours: 1 | 3; now: number } | { type: 'location'; level: string; bay: string } | { type: 'end'; now: number } | { type: 'complete' } | { type: 'redeem'; id: string; cost: number };
export function transition(state: DemoState, action: Action): DemoState {
 const session = state.session;
 if (action.type === 'start') {
  const p = facilities.find(p => p.id === action.facilityId);
  if (session || !p) return state;
  return {...state, session: {id: action.id, facilityId: p.id, facilityName: p.name, startedAt: action.now, effectiveDemoTime: action.now, demoOffsetMs: 0, level: '', bay: '', status: 'active'}};
 }
 if (action.type === 'redeem') return state.points < action.cost || state.redeemed.includes(action.id) ? state : {...state, points: state.points-action.cost, redeemed: [...state.redeemed,action.id]};
 if (!session) return state;
 if (action.type === 'complete') {
  if (session.status !== 'checkout-pending' || session.finalDurationMs === undefined || session.finalFee === undefined || session.endedAt === undefined) return state;
  if (state.history.some(h => h.id === session.id)) return {...state,session:null};
  return {...state,session:null,points:state.points+25,history:[{id:session.id,facilityId:session.facilityId,date:new Date(session.endedAt).toISOString(),minutes:Math.ceil(session.finalDurationMs/60000),cost:session.finalFee},...state.history]};
 }
 if (session.status !== 'active') return state;
 if (action.type === 'location') return {...state,session:{...session,level:action.level.trim().slice(0,20),bay:action.bay.trim().slice(0,20)}};
 if (action.type === 'advance') {
  const offset=session.demoOffsetMs+action.hours*3600000;
  return {...state,session:{...session,demoOffsetMs:offset,effectiveDemoTime:Math.max(action.now+offset,session.effectiveDemoTime+action.hours*3600000)}};
 }
 const duration=elapsedMs(session,action.now);
 return {...state,session:{...session,status:'checkout-pending',endedAt:action.now,effectiveDemoTime:session.startedAt+duration,finalDurationMs:duration,finalFee:sessionCost(0,duration)}};
}
// Upgrade older local demo sessions without discarding their facility or start time.
export function restoreState(raw: string | null): DemoState {
 if (!raw) return initialState;
 const value: unknown=JSON.parse(raw);
 if (!value || typeof value !== 'object') throw new Error('Ungültige Demo-Daten');
 const s=value as DemoState;
 if (!Number.isFinite(s.points) || s.points<0 || !Array.isArray(s.redeemed) || !s.redeemed.every(r=>typeof r==='string') || !Array.isArray(s.history) || !s.history.every(h=>typeof h.id==='string' && facilities.some(p=>p.id===h.facilityId) && typeof h.date==='string' && Number.isFinite(h.minutes) && Number.isFinite(h.cost))) throw new Error('Ungültige Demo-Daten');
 let session: Session | null=null;
 if (s.session) {
  const p=facilities.find(p=>p.id===s.session?.facilityId);
  if (!p || !Number.isFinite(s.session.startedAt)) throw new Error('Ungültige Parksession');
  const old=s.session;
  session={...old,id:old.id || `legacy-${p.id}-${old.startedAt}`,facilityName:p.name,status:old.status ?? 'active',demoOffsetMs:old.demoOffsetMs ?? 0,effectiveDemoTime:old.effectiveDemoTime ?? old.startedAt,level:old.level ?? '',bay:old.bay ?? ''};
  if (!['active','checkout-pending'].includes(session.status) || !Number.isFinite(session.demoOffsetMs) || session.demoOffsetMs<0 || !Number.isFinite(session.effectiveDemoTime) || typeof session.level!=='string' || typeof session.bay!=='string') throw new Error('Ungültige Parksession');
  if(session.status==='checkout-pending' && (!Number.isFinite(session.finalDurationMs) || !Number.isFinite(session.finalFee) || !Number.isFinite(session.endedAt))) throw new Error('Ungültiger Abschluss');
 }
 return {...s,session,history:s.history.map(h=>h.id.startsWith('sample-')?{...h,cost:sessionCost(0,h.minutes*60000)}:h)};
}
