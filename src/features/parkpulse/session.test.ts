import { describe,it,expect } from 'vitest';
import { facilities,initialState,sessionCost } from './data';
import { elapsedMs,restoreState,transition } from './session';
const start=()=>transition(initialState,{type:'start',facilityId:'quartier',id:'test-session',now:1000});
describe('Session requirements',()=>{
 it('all six facilities use the uniform €2 tariff',()=>{expect(facilities).toHaveLength(6);expect(facilities.map(p=>p.price)).toEqual([2,2,2,2,2,2]);});
 it('charges €2 per started hour with exact boundaries',()=>{expect(sessionCost(0,0)).toBe(0);expect(sessionCost(0,1)).toBe(2);expect(sessionCost(0,3600000)).toBe(2);expect(sessionCost(0,3600001)).toBe(4);expect(sessionCost(0,10800000)).toBe(6);expect(sessionCost(0,10800001)).toBe(8);});
 it('stores facility, ID, start time, effective time and parking position',()=>{const s=start().session;expect(s).toMatchObject({id:'test-session',facilityId:'quartier',facilityName:'Parkhaus am Quartier',startedAt:1000,effectiveDemoTime:1000,level:'',bay:''});});
 it('rejects a second start while active',()=>{const s=start();expect(transition(s,{type:'start',facilityId:'ufer',id:'duplicate',now:2000})).toBe(s);});
 it('saves parking level P2 and bay B14',()=>{expect(transition(start(),{type:'location',level:' P2 ',bay:' B14 '}).session).toMatchObject({level:'P2',bay:'B14'});});
 it('persists +1 and +3 demo hours through serialization',()=>{let s=transition(start(),{type:'advance',hours:1,now:1000});s=transition(s,{type:'advance',hours:3,now:1000});const restored=restoreState(JSON.stringify(s));expect(restored.session?.demoOffsetMs).toBe(14400000);if(!restored.session)throw new Error('Missing session');expect(elapsedMs(restored.session,1000)).toBe(14400000);});
 it('freezes duration and fee at checkout',()=>{const s=transition(transition(start(),{type:'advance',hours:3,now:1000}),{type:'end',now:1001});expect(s.session).toMatchObject({status:'checkout-pending',finalDurationMs:10800001,finalFee:8});if(!s.session)throw new Error('Missing session');expect(elapsedMs(s.session,99999999)).toBe(10800001);expect(transition(s,{type:'advance',hours:3,now:9999})).toBe(s);});
 it('prevents duplicate end and blocks starts during checkout',()=>{const s=transition(start(),{type:'end',now:2000});expect(transition(s,{type:'end',now:3000})).toBe(s);expect(transition(s,{type:'start',facilityId:'ufer',id:'second',now:4000})).toBe(s);expect(s.history).toHaveLength(3);});
 it('preserves checkout pending on reload',()=>{const s=transition(start(),{type:'end',now:3601001});expect(restoreState(JSON.stringify(s)).session).toEqual(s.session);});
 it('completes history and rewards only once',()=>{const pending=transition(start(),{type:'end',now:2000});const done=transition(pending,{type:'complete'});expect(done.session).toBeNull();expect(done.history.filter(h=>h.id==='test-session')).toHaveLength(1);expect(done.points).toBe(265);expect(transition(done,{type:'complete'})).toBe(done);});
 it('upgrades a legacy active session without resetting its start',()=>{const s=restoreState(JSON.stringify({...initialState,session:{facilityId:'ufer',startedAt:1234}}));expect(s.session).toMatchObject({facilityId:'ufer',startedAt:1234,id:'legacy-ufer-1234',status:'active'});});
 it('rejects corrupted session records rather than silently resetting',()=>{expect(()=>restoreState(JSON.stringify({...initialState,session:{facilityId:'missing',startedAt:1}}))).toThrow();});
});
