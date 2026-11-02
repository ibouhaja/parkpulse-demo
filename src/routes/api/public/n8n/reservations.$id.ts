import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
// Read-only status lookup for n8n. Requires X-ParkPulse-Key; returns no personal data.
export const Route = createFileRoute("/api/public/n8n/reservations/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { n8nKeyValid } = await import("@/features/parkpulse/n8n.server");
        if (!process.env["N8N_STATUS_API_KEY"]) return Response.json({ error: "not_configured" }, { status: 503 });
        if (!(await n8nKeyValid(request))) return Response.json({ error: "unauthorized" }, { status: 401 });
        const id = z.string().uuid().safeParse(params.id);
        if (!id.success) return Response.json({ error: "invalid_id" }, { status: 400 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.rpc("demo_reconcile_no_shows");
        const { data, error } = await supabaseAdmin
          .from("demo_reservations")
          .select("id,reservation_status,facility_id,level,bay,starts_at,hours,price,fee_cents,fee_percent,grace_minutes,resolved_at")
          .eq("id", id.data)
          .maybeSingle();
        if (error) return Response.json({ error: "lookup_failed" }, { status: 500 });
        if (!data) return Response.json({ error: "not_found" }, { status: 404 });
        return Response.json(
          {
            demo: true,
            id: data.id,
            status: data.reservation_status,
            remindable: data.reservation_status === "confirmed" && Date.parse(data.starts_at) > Date.now(),
            facilityId: data.facility_id,
            level: data.level,
            bay: data.bay,
            startsAt: data.starts_at,
            hours: Number(data.hours),
            priceCents: Math.round(Number(data.price) * 100),
            feeCents: data.fee_cents,
            feePercent: data.fee_percent,
            resolvedAt: data.resolved_at,
            checkedAt: new Date().toISOString(),
          },
          { headers: { "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
