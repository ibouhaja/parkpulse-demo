import { createFileRoute } from "@tanstack/react-router";
// Flushes due demo events to n8n. Returns only counters, never data; safe to trigger by the scheduler.
export const Route = createFileRoute("/api/public/n8n/dispatch")({
  server: {
    handlers: {
      POST: async () => {
        const { dispatchN8nEvents } = await import("@/features/parkpulse/n8n.server");
        return Response.json(await dispatchN8nEvents(20), { headers: { "Cache-Control": "no-store" } });
      },
    },
  },
});
