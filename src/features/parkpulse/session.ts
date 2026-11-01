import { facilities, initialState, sessionCost, type DemoState, type Session } from './data';
export const STORAGE_KEY = 'parkpulse-demo-v1';
export function elapsedMs(session: Session, now: number) {return session.status === 'checkout-pending' ? session.finalDurationMs ?? 0 : Math.max(0, Math.max(now + session.demoOffsetMs, session.effectiveDemoTime) - session.startedAt);}
export function durationText(ms: number) {const secs=Math.floor(ms/1000);return [Math.floor(secs/3600),Math.floor(secs/60)%60,secs%60].map(n=>String(n).padStart(2,'0')).join(':');}
export function checkoutAmounts(state: DemoState) {
 const s=state.session;const original=s?.finalFee ?? 0;
 const voucher=state.vouchers.find(v=>v.id===s?.voucherId && !v.usedSessionId && v.earnedSessionId!==s?.id);
 const discount=s?.discount==='SHOP2'&&!state.shop2Used?Math.min(2,original):s?.discount==='voucher'&&voucher?Math.min(10,voucher.value,original):0;
 return {original,discount,payable:Math.max(0,original-discount)};
}
export type Action = {type:'start';facilityId:string;id:string;now:number}|{type:'advance';hours:1|3;now:number}|{type:'location';level:string;bay:string;sessionId?:string|undefined}|{type:'end';now:number}|{type:'discount';discount:'none'|'SHOP2'|'voucher';voucherId?:string|undefined}|{type:'complete';sessionId:string;payment:'success'|'failure'|'free';method?:import('./data').PayMethod|undefined;now:number};
export function transition(state: DemoState, action: Action): DemoState {
 const session=state.session;
 if(action.type==='start'){const p=facilities.find(p=>p.id===action.facilityId);if(session||!p||state.history.some(h=>h.id===action.id))return state;return {...state,session:{id:action.id,facilityId:p.id,facilityName:p.name,startedAt:action.now,effectiveDemoTime:action.now,demoOffsetMs:0,level:'',bay:'',status:'active',discount:'none'}};}
 if(!session)return state;
 if(action.type==='location'){if(action.sessionId&&action.sessionId!==session.id)return state;const level=action.level.trim().slice(0,20);const bay=action.bay.trim().slice(0,20);if(!level||!bay)return state;return {...state,session:{...session,level,bay}};}
 if(action.type==='discount'){
  if(session.status!=='checkout-pending')return state;
  if(action.discount==='SHOP2'&&state.shop2Used)return state;
  if(action.discount==='voucher'&&!state.vouchers.some(v=>v.id===action.voucherId&&!v.usedSessionId&&v.earnedSessionId!==session.id))return state;
  return {...state,session:{...session,discount:action.discount,voucherId:action.discount==='voucher'?action.voucherId:undefined}};
 }
 if(action.type==='complete'){
  if(session.id!==action.sessionId||session.status!=='checkout-pending'||session.finalDurationMs===undefined||session.finalFee===undefined||session.endedAt===undefined||state.history.some(h=>h.id===session.id)||state.receipts.some(r=>r.sessionId===session.id))return state;
  const amount=checkoutAmounts(state);
  if(action.payment==='failure'||(amount.payable>0&&action.payment!=='success'))return state;
  const receiptId=`beleg-${session.id}`;
  let stamps=state.stamps+(amount.payable>0?1:0);
  let vouchers=state.vouchers.map(v=>session.discount==='voucher'&&v.id===session.voucherId&&amount.discount>0?{...v,usedSessionId:session.id}:v);
  if(stamps===6){stamps=0;vouchers=[...vouchers,{id:`gutschein-${session.id}`,value:10,earnedSessionId:session.id}];}
  const date=new Date(action.now).toISOString();
  return {...state,session:null,stamps,vouchers,shop2Used:state.shop2Used||(session.discount==='SHOP2'&&amount.discount>0),receipts:[{id:receiptId,sessionId:session.id,date,originalFee:amount.original,discountAmount:amount.discount,payable:amount.payable,discount:session.discount ?? 'none',payment:amount.payable===0?'free':'success',...(amount.payable>0?{method:action.method??'card'}:{}),level:session.level,bay:session.bay},...state.receipts],history:[{id:session.id,facilityId:session.facilityId,date,minutes:Math.ceil(session.finalDurationMs/60000),cost:amount.payable,originalFee:amount.original,discountAmount:amount.discount,level:session.level,bay:session.bay,receiptId,session:{...session}},...state.history]};
 }
 if(session.status!=='active')return state;
 if(action.type==='advance'){const offset=session.demoOffsetMs+action.hours*3600000;return {...state,session:{...session,demoOffsetMs:offset,effectiveDemoTime:Math.max(action.now+offset,session.effectiveDemoTime+action.hours*3600000)}};}
 const duration=elapsedMs(session,action.now);return {...state,session:{...session,status:'checkout-pending',endedAt:action.now,effectiveDemoTime:session.startedAt+duration,finalDurationMs:duration,finalFee:sessionCost(0,duration)}};
}
export function restoreState(raw: string|null):DemoState {
 if(!raw)return initialState;
 const value:unknown=JSON.parse(raw);if(!value||typeof value!=='object')throw new Error('Ungültige Demo-Daten');
 const s=value as DemoState;
 if(!Array.isArray(s.history)||!s.history.every(h=>typeof h.id==='string'&&facilities.some(p=>p.id===h.facilityId)&&typeof h.date==='string'&&Number.isFinite(h.minutes)&&Number.isFinite(h.cost)))throw new Error('Ungültiger Verlauf');
 let session:Session|null=null;
 if(s.session){const p=facilities.find(p=>p.id===s.session?.facilityId);const old=s.session;if(!p||!Number.isFinite(old.startedAt))throw new Error('Ungültige Parksession');session={...old,id:old.id||`legacy-${p.id}-${old.startedAt}`,facilityName:p.name,status:old.status??'active',demoOffsetMs:old.demoOffsetMs??0,effectiveDemoTime:old.effectiveDemoTime??old.startedAt,level:old.level??'',bay:old.bay??''};if(!['active','checkout-pending'].includes(session.status)||!Number.isFinite(session.demoOffsetMs)||session.demoOffsetMs<0||!Number.isFinite(session.effectiveDemoTime)||typeof session.level!=='string'||typeof session.bay!=='string')throw new Error('Ungültige Parksession');if(session.status==='checkout-pending'&&(!Number.isFinite(session.finalDurationMs)||!Number.isFinite(session.finalFee)||!Number.isFinite(session.endedAt)))throw new Error('Ungültiger Abschluss');}
 if(s.schemaVersion===2){if(!Number.isInteger(s.stamps)||s.stamps<0||s.stamps>5||!Array.isArray(s.vouchers)||!s.vouchers.every(v=>typeof v.id==='string'&&v.value===10&&typeof v.earnedSessionId==='string')||!Array.isArray(s.receipts)||!s.receipts.every(r=>typeof r.id==='string'&&typeof r.sessionId==='string'&&Number.isFinite(r.payable))||typeof s.shop2Used!=='boolean')throw new Error('Ungültige Stempelkarte');return {...s,session};}
 // Preserve the legacy session, frozen values and history; initialize only the new loyalty fields.
 return {...initialState,...s,schemaVersion:2,session,stamps:5,vouchers:[],shop2Used:false,receipts:[]};
}
