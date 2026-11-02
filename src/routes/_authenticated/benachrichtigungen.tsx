import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useState } from 'react';
import { Bell, RefreshCw, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeading, pageHead } from '@/features/parkpulse/shared';
import { getNotifications, deliverNow } from '@/features/parkpulse/n8n.functions';
import { useDemo } from '@/features/parkpulse/store';

export const Route = createFileRoute('/_authenticated/benachrichtigungen')({
  head: () => pageHead('Demo-Benachrichtigungen', 'Demo-Erinnerungen aus der n8n-Automation und Zustellstatus deiner Reservierungsereignisse.'),
  component: NotificationsPage,
});
const typeLabel: Record<string, string> = {
  'reservation.confirmed': 'Reservierung bestätigt',
  'reservation.cancelled': 'Reservierung storniert',
  'reservation.rescheduled': 'Reservierung verschoben',
  'reservation.no_show': 'No-Show',
};
const statusLabel: Record<string, string> = { pending: 'Wartet', sending: 'Wird gesendet', sent: 'An n8n gesendet', failed: 'Fehlgeschlagen' };
const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString('de-DE', { timeZone: 'Europe/Berlin', dateStyle: 'short', timeStyle: 'short' }) : '–');

function NotificationsPage() {
  const { userId } = useDemo();
  const load = useServerFn(getNotifications);
  const deliver = useServerFn(deliverNow);
  const q = useQuery({ queryKey: ['notifications', userId], queryFn: () => load(), refetchInterval: 15000 });
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState('');
  const send = async () => {
    setBusy(true); setInfo('');
    try {
      const r = await deliver();
      setInfo(r.configured ? `${r.sent} gesendet · ${r.retry} erneut geplant · ${r.failed} fehlgeschlagen` : 'n8n ist noch nicht eingerichtet – Ereignisse bleiben gespeichert.');
      await q.refetch();
    } finally { setBusy(false); }
  };
  return <>
    <PageHeading eyebrow="AUTOMATION · DEMO" title="Benachrichtigungen" subtitle="Erinnerungen, die deine n8n-Automation als Demo zurückmeldet. Es werden keine echten E-Mails versendet." />
    {q.error && <p role="alert" className="text-destructive">{q.error.message}</p>}
    {q.data && !q.data.configured && <p className="demo-notice" role="status">n8n ist noch nicht verbunden. Reservierungsereignisse werden gespeichert und nach der Einrichtung automatisch zugestellt.</p>}
    <div className="section-heading"><h2><Bell size={18} className="inline mr-2" />Demo-Erinnerungen</h2><span className="section-subtitle">{q.data?.reminders.length ?? 0} Einträge</span></div>
    <div className="grid gap-3 mb-8">
      {q.data?.reminders.length === 0 && <p className="text-muted-foreground">Noch keine Demo-Erinnerungen. Sobald n8n eine Erinnerung erstellt, erscheint sie hier.</p>}
      {q.data?.reminders.map(r => <article key={r.id} className="rounded-lg border bg-card p-4">
        <div className="flex flex-wrap justify-between gap-2"><strong>{r.title}</strong><span className="ev-tag">Demo · keine E-Mail</span></div>
        <p className="mt-2">{r.message}</p>
        <small className="text-muted-foreground">Erstellt {fmt(r.created_at)}{r.scheduled_for ? ` · geplant für ${fmt(r.scheduled_for)}` : ''} · Reservierung {r.reservation_id.slice(0, 8)}</small>
      </article>)}
    </div>
    <div className="section-heading"><h2>Ereignisse an n8n</h2><Button variant="outline" disabled={busy} onClick={() => void send()}>{busy ? <RefreshCw className="animate-spin" /> : <Send />}Jetzt zustellen</Button></div>
    {info && <p role="status" className="mb-3">{info}</p>}
    <div className="table-wrap"><table className="history-table"><thead><tr><th>Ereignis</th><th>Zeit</th><th>Zustellung</th><th>Versuche</th><th>Event-ID</th></tr></thead><tbody>
      {q.data?.events.map(e => <tr key={e.id}>
        <td><strong>{typeLabel[e.event_type] ?? e.event_type}</strong><small>Reservierung {e.reservation_id.slice(0, 8)}</small></td>
        <td>{fmt(e.created_at)}</td>
        <td><span className="ev-tag">{statusLabel[e.delivery_status] ?? e.delivery_status}</span>{e.delivery_status === 'pending' && e.attempts > 0 && <small>Nächster Versuch {fmt(e.next_attempt_at)}</small>}{e.last_error && e.delivery_status !== 'sent' && <small>{e.last_http_status ? `HTTP ${e.last_http_status}` : 'Nicht erreichbar'}</small>}</td>
        <td>{e.attempts}</td>
        <td><small className="break-all">{e.id}</small></td>
      </tr>)}
    </tbody></table></div>
  </>;
}
