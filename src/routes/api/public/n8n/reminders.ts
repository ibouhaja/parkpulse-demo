import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
// n8n records a DEMO reminder here instead of sending a real email. Requires X-ParkPulse-Key.
const body = z.object({
  reservationId: z.string().uuid(),
  idempotencyKey: z.string().min(1).max(120),
  sourceEventId: z.string().uuid().optional(),
  title: z.string().min(1).max(120).optional(),
  message: z.string().min(1).max(1000),
  scheduledFor: z.string().datetime({ offset: true }).optional(),
});
export const Route = createFileRoute("/api/public/n8n/reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { n8nKeyValid } = await import("@/features/parkpulse/n8n.server");
        if (!process.env["N8N_STATUS_API_KEY"]) return Response.json({ error: "not_configured" }, { status: 503 });
        if (!(await n8nKeyValid(request))) return Response.json({ error: "unauthorized" }, { status: 401 });
        const parsed = body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "invalid_body" }, { status: 400 });
        const b = parsed.data;
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: r } = await supabaseAdmin
          .from("demo_reservations")
          .select("id,user_id,reservation_status")
          .eq("id", b.reservationId)
          .maybeSingle();
        if (!r) return Response.json({ error: "not_found" }, { status: 404 });
        // Latest status is re-checked here too: no reminders for cancelled/no-show reservations.
        if (r.reservation_status !== "confirmed")
          return Response.json({ recorded: false, reason: "not_confirmed", status: r.reservation_status }, { status: 409 });
        const { data, error } = await supabaseAdmin
          .from("demo_reminders")
          .upsert(
            {
              user_id: r.user_id,
              reservation_id: r.id,
              idempotency_key: b.idempotencyKey,
              source_event_id: b.sourceEventId ?? null,
              title: b.title ?? "Erinnerung an deine Demo-Reservierung",
              message: b.message,
              reservation_status: r.reservation_status,
              scheduled_for: b.scheduledFor ?? null,
            },
            { onConflict: "reservation_id,idempotency_key", ignoreDuplicates: true },
          )
          .select("id");
        if (error) return Response.json({ error: "store_failed" }, { status: 500 });
        return Response.json({ recorded: true, duplicate: !data?.length, demo: true, realEmailSent: false });
      },
    },
  },
});
