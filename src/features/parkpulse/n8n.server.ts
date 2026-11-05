import { deliveryOutcome, hmacHex, retryDelayMs, validWebhookUrl, webhookBody, N8N_TIMEOUT_MS, type OutboxEvent } from './n8n-rules';

/** Delivers due outbox events to n8n. Never throws; reservation flows must not depend on n8n. */
export async function dispatchN8nEvents(limit = 10): Promise<{ configured: boolean; sent: number; retry: number; failed: number }> {
  const url = process.env['N8N_WEBHOOK_URL'];
  const secret = process.env['N8N_WEBHOOK_SECRET'];
  const result = { configured: validWebhookUrl(url) && !!secret, sent: 0, retry: 0, failed: 0 };
  if (!result.configured) return result; // events stay "pending" until configured
  try {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data, error } = await supabaseAdmin.rpc('n8n_claim_events', { p_limit: limit });
    if (error) { console.error('n8n claim failed', error.message); return result; }
    for (const e of (data ?? []) as OutboxEvent[]) {
      const body = webhookBody(e);
      const timestamp = String(Math.floor(Date.now() / 1000));
      let status: number | null = null; let errText: string | null = null;
      try {
        const res = await fetch(url!, {
          method: 'POST',
          signal: AbortSignal.timeout(N8N_TIMEOUT_MS),
          headers: {
            'Content-Type': 'application/json',
            'X-ParkPulse-Secret': secret!,
            'X-ParkPulse-Event-Id': e.id,
            'X-ParkPulse-Timestamp': timestamp,
            'X-ParkPulse-Signature': `sha256=${await hmacHex(secret!, `${timestamp}.${body}`)}`,
          },
          body,
        });
        status = res.status;
        if (!res.ok) errText = `HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`;
      } catch (err) {
        errText = err instanceof Error ? err.name + ': ' + err.message : 'Netzwerkfehler';
      }
      const outcome = deliveryOutcome(status, e.attempts);
      result[outcome === 'sent' ? 'sent' : outcome === 'pending' ? 'retry' : 'failed']++;
      if (outcome !== 'sent') console.warn('n8n delivery', e.id, e.event_type, outcome, errText);
      await supabaseAdmin.from('integration_events').update({
        delivery_status: outcome,
        last_http_status: status,
        last_error: errText,
        lease_until: null,
        sent_at: outcome === 'sent' ? new Date().toISOString() : null,
        next_attempt_at: new Date(Date.now() + (outcome === 'pending' ? retryDelayMs(e.attempts) : 0)).toISOString(),
      }).eq('id', e.id);
    }
  } catch (err) {
    console.error('n8n dispatch error', err instanceof Error ? err.message : err);
  }
  return result;
}

/** Best-effort, time-boxed delivery right after a reservation change. */
export async function kickN8n() {
  await Promise.race([dispatchN8nEvents(5), new Promise(r => setTimeout(r, 2500))]).catch(() => undefined);
}

export function n8nKeyValid(request: Request) {
  return import('./n8n-rules').then(m => m.safeEqual(request.headers.get('x-parkpulse-key'), process.env['N8N_STATUS_API_KEY']));
}
