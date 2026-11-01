import { z } from "zod";
import { facilities } from "./data";
import {
  createParkingPlan,
  defaultFilters,
  matchesSpot,
  protectSessionPosition,
  type ParkingFilters,
} from "./parking-plan";
import type { HeldPosition } from "./reservation-rules";
import { reservationPrice } from "./map-rules";
import { earnedPoints } from "./points";
import { tariffs } from "./tariffs";

export const agentCriteria = z.object({
  hours: z.number().positive().max(72),
  startsAt: z.string().datetime({ offset: true }),
  budget: z.number().nonnegative(),
  vehicle: z.enum(["car", "ev", "suv", "van", "truck"]),
  height: z.number().positive().max(5),
  width: z.number().positive().max(4),
  length: z.number().positive().max(15),
  weight: z.number().positive().max(20000),
  wallbox: z.boolean(),
  family: z.boolean(),
  women: z.boolean(),
  accessible: z.boolean(),
  priority: z.enum(["points", "price", "distance"]),
});
export type AgentCriteria = z.infer<typeof agentCriteria>;
export type AgentOffer = {
  id: string;
  facility: string;
  name: string;
  level: string;
  bay: string;
  startsAt: string;
  hours: number;
  price: number;
  budget: number;
  points: number;
  distance: number;
  available: number;
  equipment: string[];
  filters: ParkingFilters;
  expiresAt: number;
};
export const filtersFromCriteria = (c: AgentCriteria): ParkingFilters => ({
  vehicle: c.vehicle,
  height: c.height,
  width: c.width,
  length: c.length,
  weight: c.weight,
  needs: { wallbox: c.wallbox, family: c.family, women: c.women, accessible: c.accessible },
});
export function agentSpots(id: string, held: HeldPosition[]) {
  return held
    .filter((h) => h.facility_id === id)
    .reduce((spots, h) => protectSessionPosition(spots, h), createParkingPlan(id));
}
export function compareAgentOffers(
  criteria: AgentCriteria,
  held: HeldPosition[],
  now: number,
  ids = facilities.map((f) => f.id),
): AgentOffer[] {
  const c = agentCriteria.parse(criteria);
  const start = Date.parse(c.startsAt);
  if (start < now - 60000 || start > now + 365 * 86400000) return [];
  const filters = filtersFromCriteria(c);
  return facilities
    .filter((f) => ids.includes(f.id))
    .flatMap((f) => {
      const spots = agentSpots(f.id, held).filter(
        (s) => !s.occupied && !s.unknown && matchesSpot(s, filters),
      );
      const s = spots[0];
      const price = reservationPrice(c.hours, f.id, start);
      if (!s || price === null || Math.round(price * 100) > Math.floor(c.budget * 100)) return [];
      return [
        {
          id: crypto.randomUUID(),
          facility: f.id,
          name: f.name,
          level: s.level,
          bay: s.bay,
          startsAt: c.startsAt,
          hours: c.hours,
          price,
          budget: c.budget,
          points: earnedPoints(price, false, tariffs[f.id]).total,
          distance: f.distance,
          available: spots.length,
          equipment: [
            s.charging ? `Wallbox ${s.charging.power} kW` : "",
            s.accessible ? "Barrierefreier Zugang" : "",
            s.category === "family" ? "Familienplatz" : "",
            s.category === "women" ? "Frauenparkplatz" : "",
          ].filter(Boolean),
          filters,
          expiresAt: now + 15 * 60000,
        },
      ];
    })
    .sort((a, b) =>
      c.priority === "points"
        ? b.points - a.points || a.price - b.price
        : c.priority === "price"
          ? a.price - b.price || b.points - a.points
          : a.distance - b.distance || a.price - b.price,
    )
    .slice(0, 3);
}
export function validConfirmedOffer(
  offer: AgentOffer,
  confirmation: string | undefined,
  now: number,
) {
  return (
    confirmation === offer.id &&
    now <= offer.expiresAt &&
    Math.round(offer.price * 100) <= Math.floor(offer.budget * 100) &&
    reservationPrice(offer.hours, offer.facility, Date.parse(offer.startsAt)) === offer.price
  );
}
export const agentDefaultFilters = defaultFilters;
