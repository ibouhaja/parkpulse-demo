import type { Tariff } from './tariffs';
export type PointEntry = { id: string; date: string; points: number; kind: 'earned' | 'redeemed'; sessionId?: string; voucherId?: string; basePoints?: number; promotionPoints?: number };
export const redemptionTiers = [1000, 2000, 5000, 10000] as const;
export function earnedPoints(payable: number, voucherUsed: boolean, tariff?: Tariff) {
  const base = payable > 0 && !voucherUsed ? Math.floor(Math.round(payable * 100)) : 0;
  const promotion = base > 0 ? tariff?.promotionPoints ?? 0 : 0;
  return { base, promotion, total: base + promotion };
}