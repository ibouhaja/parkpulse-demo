import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { quoteCancellation, cancelReservation } from './reservations.functions';
import { useReservations } from './reservations-provider';
import { money } from './data';
import type { CancellationQuote } from './cancellation-rules';
import { useI18n } from './i18n';

export function CancellationTerms() {
  const { t } = useI18n();
  return <div className="space-y-2 text-xs text-muted-foreground">
    <h4 className="font-semibold text-foreground">{t('Stornierungsbedingungen · Demo')}</h4>
    <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1">
      <dt>{t('Mehr als 2 Stunden vor Beginn')}</dt><dd>{t('kostenlos')}</dd>
      <dt>{t('1 bis 2 Stunden vor Beginn')}</dt><dd>50 %</dd>
      <dt>{t('Weniger als 1 Stunde vor Beginn')}</dt><dd>100 %</dd>
      <dt>{t('Nicht erschienen (No-Show)')}</dt><dd>100 %</dd>
    </dl>
    <p>{t('Genau 2 Stunden und genau 1 Stunde: 50 %. Verschieben gilt als Stornierung der alten Reservierung. Grundlage ist der angezeigte Gesamtparkpreis vor Bonuspunkten und Gutscheinen.')}</p>
    <p>{t('Demo-Kulanzfrist: 15 Minuten nach Beginn. Ohne Check-in folgt No-Show. Keine Punkte oder Treuestempel bei Stornierung oder No-Show. Nur simulierte Gebühren, keine echte Abbuchung.')}</p>
  </div>;
}
export function CancelReservationButton({ id, disabled, onCancelled }: { id: string; disabled?: boolean; onCancelled?: () => void }) {
  const preview=useServerFn(quoteCancellation); const cancel=useServerFn(cancelReservation); const {refresh}=useReservations();
  const { t, lang } = useI18n();
  const [open,setOpen]=useState(false); const [quote,setQuote]=useState<CancellationQuote|null>(null); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
  const load=async()=>{setOpen(true);setBusy(true);setQuote(null);setError('');try{setQuote(await preview({data:{id}}));}catch(e){setError(e instanceof Error?e.message:t('Gebühr konnte nicht geladen werden.'));await refresh();}finally{setBusy(false);}};
  const confirm=async()=>{if(!quote||busy)return;setBusy(true);setError('');try{await cancel({data:{quoteId:quote.id,confirmed:true}});await refresh();setOpen(false);onCancelled?.();}catch(e){setError(e instanceof Error?e.message:t('Stornierung fehlgeschlagen.'));setQuote(null);await refresh();}finally{setBusy(false);}};
  return <><Button variant="ghost" disabled={disabled||busy} onClick={()=>void load()}>{t('Stornieren')}</Button>
    <Dialog open={open} onOpenChange={value=>{if(!busy)setOpen(value);}}><DialogContent><DialogTitle>{t('Reservierung stornieren?')}</DialogTitle><DialogDescription>{t('Die Gebühr wird nur simuliert. Es wird kein Geld abgebucht.')}</DialogDescription>
      {busy&&!quote&&<p role="status">{t('Gebühr wird geprüft …')}</p>}
      {quote&&<div className="space-y-2"><p>{t('Gesamtparkpreis vor Punkten und Gutscheinen:')} <strong>{money(quote.price,lang)}</strong></p><p>{t('Stornierungsgebühr')} ({quote.percent} %): <strong>{money(quote.feeCents/100,lang)}</strong></p><p className="text-xs text-muted-foreground">{t('Vorschau maximal 60 Sekunden gültig; bei einem Wechsel der Gebührenstufe ist eine neue Bestätigung nötig.')}</p></div>}
      <CancellationTerms/>{error&&<p role="alert" className="text-destructive">{error}</p>}
      <DialogFooter><Button variant="outline" disabled={busy} onClick={()=>setOpen(false)}>{t('Abbrechen')}</Button>{quote?<Button disabled={busy} onClick={()=>void confirm()}>{t('Stornierung bestätigen')} · {money(quote.feeCents/100,lang)} ({t('Demo')})</Button>:<Button disabled={busy} onClick={()=>void load()}>{t('Gebühr erneut prüfen')}</Button>}</DialogFooter>
    </DialogContent></Dialog>
  </>;
}
