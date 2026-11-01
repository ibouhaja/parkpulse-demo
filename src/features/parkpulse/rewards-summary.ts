import type { DemoState } from './data';
export function rewardsSummary(state:DemoState){
 const balance=state.pointsBalance??0;
 const next=Math.floor(balance/1000+1)*1000;
 return {balance,next,remaining:next-balance,progress:balance%1000,earned:(state.pointsHistory??[]).filter(e=>e.kind==='earned').reduce((sum,e)=>sum+e.points,0),available:state.vouchers.filter(v=>!v.usedSessionId),used:state.vouchers.filter(v=>!!v.usedSessionId)};
}