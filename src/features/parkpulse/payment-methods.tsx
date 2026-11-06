import { siBitcoin, siKlarna, siPaypal, siVisa } from 'simple-icons';
import type { PayMethod } from './data';
import { useI18n } from './i18n';

// Brand marks from Simple Icons, shown unmodified in their official brand colour for
// identification only. ParkPulse is not affiliated with these brands; all payments are simulated.
const demoMethodDefs = [
  { id: 'paypal', name: 'PayPal', icon: siPaypal, hint: 'Simuliert · kein Konto' },
  { id: 'klarna', name: 'Klarna', icon: siKlarna, hint: 'Simuliert · keine Prüfung' },
  { id: 'visa', name: 'Visa', icon: siVisa, hint: 'Simuliert · keine Kartendaten' },
  { id: 'bitcoin', name: 'Bitcoin (BTC)', icon: siBitcoin, hint: 'Simuliert · keine Wallet' },
] as const satisfies readonly { id: PayMethod; name: string; icon: { path: string; hex: string; title: string }; hint: string }[];

export function BrandLogo({ method, size = 32 }: { method: PayMethod; size?: number }) {
  const m = demoMethodDefs.find((d) => d.id === method);
  if (!m) return null;
  return (
    <svg role="img" aria-label={`${m.icon.title}-Logo`} viewBox="0 0 24 24" width={size} height={size} fill={`#${m.icon.hex}`}>
      <path d={m.icon.path} />
    </svg>
  );
}

export function PaymentTiles({ value, onChange }: { value: PayMethod | null; onChange: (m: PayMethod) => void }) {
  const { t } = useI18n();
  return (
    <div role="radiogroup" aria-label={t('Zahlungsmethode (Demo)')} className="grid grid-cols-2 gap-3">
      {demoMethodDefs.map((m) => {
        const active = value === m.id;
        return (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(m.id)}
            className={`flex flex-col items-center gap-2 rounded-md border p-4 text-center transition-colors ${active ? 'border-primary bg-accent ring-2 ring-primary' : 'bg-card hover:bg-accent'}`}
          >
            <span className="flex h-12 w-full items-center justify-center rounded bg-background"><BrandLogo method={m.id} /></span>
            <strong className="text-sm">{m.name}</strong>
            <span className="text-[11px] text-muted-foreground">{t(m.hint)}</span>
          </button>
        );
      })}
    </div>
  );
}
