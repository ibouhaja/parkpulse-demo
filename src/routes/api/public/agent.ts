import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/public/agent")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleAgent } = await import("@/features/parkpulse/agent.server");
        return handleAgent(request);
      },
    },
  },
});
