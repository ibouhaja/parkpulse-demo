import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { quoteCancellation, cancelReservation } from './reservations.functions';
import { useReservations } from './reservations-provider';
import { money } from './data';
import type { CancellationQuote } from './cancellation-rules';

export function CancellationTerms() {
  return <div className="space-y-2 text-xs text-muted-foreground">
    <h4 className="font-semibold text-foreground">Stornierungsbedingungen · Demo</h4>
    <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1">
      <dt>Mehr als 3 Stunden vor Beginn</dt><dd>0 %</dd>
      <dt>2 bis 3 Stunden vor Beginn</dt><dd>25 %</dd>
      <dt>1 bis unter 2 Stunden vor Beginn</dt><dd>50 %</dd>
      <dt>Weniger als 1 Stunde vor Beginn</dt><dd>100 %</dd>
      <dt>Nicht erschienen (No-Show)</dt><dd>100 %</dd>
    </dl>
    <p>Genau 2 und 3 Stunden: 25 %. Genau 1 Stunde: 50 %. Grundlage ist der angezeigte Gesamtparkpreis vor Bonuspunkten und Gutscheinen.</p>
    <p>Demo-Kulanzfrist: 15 Minuten nach Beginn. Ohne Check-in folgt No-Show. Keine Punkte oder Treuestempel bei Stornierung oder No-Show. Nur simulierte Gebühren, keine echte Abbuchung.</p>
  </div>;
}
export function CancelReservationButton({ id, disabled, onCancelled }: { id: string; disabled?: boolean; onCancelled?: () => void }) {
  const preview=useServerFn(quoteCancellation); const cancel=useServerFn(cancelReservation); const {refresh}=useReservations();
  const [open,setOpen]=useState(false); const [quote,setQuote]=useState<CancellationQuote|null>(null); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
  const load=async()=>{setOpen(true);setBusy(true);setQuote(null);setError('');try{setQuote(await preview({data:{id}}));}catch(e){setError(e instanceof Error?e.message:'Gebühr konnte nicht geladen werden.');await refresh();}finally{setBusy(false);}};
  const confirm=async()=>{if(!quote||busy)return;setBusy(true);setError('');try{await cancel({data:{quoteId:quote.id,confirmed:true}});await refresh();setOpen(false);onCancelled?.();}catch(e){setError(e instanceof Error?e.message:'Stornierung fehlgeschlagen.');setQuote(null);await refresh();}finally{setBusy(false);}};
  return <><Button variant="ghost" disabled={disabled||busy} onClick={()=>void load()}>Stornieren</Button>
    <Dialog open={open} onOpenChange={value=>{if(!busy)setOpen(value);}}><DialogContent><DialogTitle>Reservierung stornieren?</DialogTitle><DialogDescription>Die Gebühr wird nur simuliert. Es wird kein Geld abgebucht.</DialogDescription>
      {busy&&!quote&&<p role="status">Gebühr wird geprüft …</p>}
      {quote&&<div className="space-y-2"><p>Gesamtparkpreis vor Punkten und Gutscheinen: <strong>{money(quote.price)}</strong></p><p>Stornierungsgebühr ({quote.percent} %): <strong>{money(quote.feeCents/100)}</strong></p><p className="text-xs text-muted-foreground">Vorschau maximal 60 Sekunden gültig; bei einem Wechsel der Gebührenstufe ist eine neue Bestätigung nötig.</p></div>}
      <CancellationTerms/>{error&&<p role="alert" className="text-destructive">{error}</p>}
      <DialogFooter><Button variant="outline" disabled={busy} onClick={()=>setOpen(false)}>Abbrechen</Button>{quote?<Button disabled={busy} onClick={()=>void confirm()}>Stornierung bestätigen · {money(quote.feeCents/100)} (Demo)</Button>:<Button disabled={busy} onClick={()=>void load()}>Gebühr erneut prüfen</Button>}</DialogFooter>
    </DialogContent></Dialog>
  </>;
}