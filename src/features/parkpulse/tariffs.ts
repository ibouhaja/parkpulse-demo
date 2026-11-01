export type Tariff = { version: number; hourlyCents: number; firstHourCents: number; eveningCents: number; dailyCapCents: number; shoppingCents: number; promotionPoints: number; referencePoints: number; offer: string };
export const legacyTariff: Tariff = { version: 0, hourlyCents: 200, firstHourCents: 200, eveningCents: 200, dailyCapCents: 4800, shoppingCents: 0, promotionPoints: 0, referencePoints: 0, offer: 'Bestandstarif' };
export const tariffs: Record<string, Tariff> = {
  quartier: { version: 1, hourlyCents: 149, firstHourCents: 99, eveningCents: 99, dailyCapCents: 999, shoppingCents: 100, promotionPoints: 202, referencePoints: 450, offer: 'Erste Stunde 0,99 €' },
  ufer: { version: 1, hourlyCents: 199, firstHourCents: 149, eveningCents: 129, dailyCapCents: 1299, shoppingCents: 0, promotionPoints: 402, referencePoints: 750, offer: 'Top-Angebot · erste Stunde 1,49 €' },
  stadtgarten: { version: 1, hourlyCents: 99, firstHourCents: 49, eveningCents: 79, dailyCapCents: 599, shoppingCents: 100, promotionPoints: 152, referencePoints: 300, offer: 'Günstigster Preis · erste Stunde 0,49 €' },
  werk: { version: 1, hourlyCents: 249, firstHourCents: 199, eveningCents: 149, dailyCapCents: 1599, shoppingCents: 200, promotionPoints: 752, referencePoints: 1200, offer: 'Top-Angebot · erste Stunde 1,99 €' },
  markt: { version: 1, hourlyCents: 299, firstHourCents: 249, eveningCents: 199, dailyCapCents: 1899, shoppingCents: 150, promotionPoints: 452, referencePoints: 1000, offer: 'Shopping-Rabatt bis 1,50 €' },
  nord: { version: 1, hourlyCents: 129, firstHourCents: 79, eveningCents: 89, dailyCapCents: 699, shoppingCents: 0, promotionPoints: 292, referencePoints: 500, offer: 'Erste Stunde 0,79 €' },
};
const berlinHour = (time: number) => Number(new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', hourCycle: 'h23' }).format(time));
/** Each started hour uses its Berlin start time; daily cap applies per rolling 24-hour parking block. */
export function tariffFeeCents(tariff: Tariff, startedAt: number, durationMs: number) {
  if (!Number.isFinite(durationMs) || durationMs <= 0) return 0;
  if (tariff.version === 0) return Math.ceil(durationMs / 3600000) * 200;
  let total = 0;
  const hours = Math.ceil(durationMs / 3600000);
  for (let block = 0; block < hours; block += 24) {
    let daily = 0;
    for (let i = block; i < Math.min(block + 24, hours); i++) {
      const h = berlinHour(startedAt + i * 3600000);
      const evening = h >= 18 || h < 6;
      daily += Math.min(tariff.hourlyCents, evening ? tariff.eveningCents : tariff.hourlyCents, i === 0 ? tariff.firstHourCents : tariff.hourlyCents);
    }
    total += Math.min(daily, tariff.dailyCapCents);
  }
  return total;
}
export function tariffDescription(t: Tariff) {
  const eur = (c: number) => (c / 100).toLocaleString('de-DE', { minimumFractionDigits: 2 });
  return t.version === 0 ? '2,00 € je angefangene Stunde · Bestandstarif' : `${eur(t.hourlyCents)} €/h · erste Stunde ${eur(t.firstHourCents)} € · abends 18–06 Uhr ${eur(t.eveningCents)} €/h · max. ${eur(t.dailyCapCents)} € je 24 h`;
}