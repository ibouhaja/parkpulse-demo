import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { facilities } from './data';
import { createParkingPlan, simulateOccupancy, type ParkingSpot } from './parking-plan';

type PlanState = { spots: ParkingSpot[]; step: number };
const initialPlans = () => Object.fromEntries(facilities.map(p => [p.id, { spots: createParkingPlan(p.id), step: 0 }]));
const PlanContext = createContext<{ plans: Record<string, PlanState>; simulate: (id: string) => void } | null>(null);

export function ParkingPlanProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<Record<string, PlanState>>(initialPlans);
  const simulate = useCallback((id: string) => setPlans(prev => {
    const plan = prev[id];
    if (!plan) return prev;
    return { ...prev, [id]: { spots: simulateOccupancy(plan.spots, plan.step), step: plan.step + 1 } };
  }), []);
  return <PlanContext.Provider value={{ plans, simulate }}>{children}</PlanContext.Provider>;
}

export function useParkingPlan() {
  const value = useContext(PlanContext);
  if (!value) throw new Error('Demo-Parkhausplan nicht verfügbar');
  return value;
}