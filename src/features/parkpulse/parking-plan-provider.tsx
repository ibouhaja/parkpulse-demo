import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { facilities, type Session } from './data';
import { createParkingPlan, protectSessionPosition, simulateOccupancy, type ParkingSpot } from './parking-plan';
import { useReservations } from './reservations-provider';

type PlanState = { spots: ParkingSpot[]; step: number };
const initialPlans = () => Object.fromEntries(facilities.map(p => [p.id, { spots: createParkingPlan(p.id), step: 0 }]));
const PlanContext = createContext<{ plans: Record<string, PlanState>; simulate: (id: string) => void } | null>(null);

export function ParkingPlanProvider({ children, session }: { children: ReactNode; session: Session | null }) {
  const [plans, setPlans] = useState<Record<string, PlanState>>(initialPlans);
  const {held}=useReservations();
  const simulate = useCallback((id: string) => setPlans(prev => {
    const plan = prev[id];
    if (!plan) return prev;
    return { ...prev, [id]: { spots: simulateOccupancy(plan.spots, plan.step), step: plan.step + 1 } };
  }), []);
  const protectedPlans = Object.fromEntries(Object.entries(plans).map(([id, plan]) => {
    let spots=session?.facilityId===id?protectSessionPosition(plan.spots,session):plan.spots;
    for(const p of held.filter(p=>p.facility_id===id))spots=protectSessionPosition(spots,p);
    return [id,{...plan,spots}];
  }));
  return <PlanContext.Provider value={{ plans: protectedPlans, simulate }}>{children}</PlanContext.Provider>;
}

export function useParkingPlan() {
  const value = useContext(PlanContext);
  if (!value) throw new Error('Demo-Parkhausplan nicht verfügbar');
  return value;
}