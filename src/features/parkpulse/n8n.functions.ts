import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

export const getNotifications = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const [reminders, events] = await Promise.all([
    context.supabase.from('demo_reminders').select('id,reservation_id,title,message,reservation_status,scheduled_for,created_at').eq('user_id', context.userId).order('created_at', { ascending: false }).limit(50),
    context.supabase.from('integration_events').select('id,event_type,reservation_id,previous_reservation_id,delivery_status,attempts,last_http_status,last_error,next_attempt_at,sent_at,created_at').eq('user_id', context.userId).order('created_at', { ascending: false }).limit(50),
  ]);
  if (reminders.error || events.error) throw new Error('Benachrichtigungen konnten nicht geladen werden.');
  const configured = !!process.env['N8N_WEBHOOK_URL'] && !!process.env['N8N_WEBHOOK_SECRET'];
  return { reminders: reminders.data, events: events.data, configured, statusApiConfigured: !!process.env['N8N_STATUS_API_KEY'] };
});

export const deliverNow = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).handler(async () => {
  const { dispatchN8nEvents } = await import('./n8n.server');
  return dispatchN8nEvents(10);
});
