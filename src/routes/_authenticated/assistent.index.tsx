import { createFileRoute } from "@tanstack/react-router";
import { AgentPage } from "@/features/parkpulse/agent-chat";
import { pageHead } from "@/features/parkpulse/shared";
export const Route = createFileRoute("/_authenticated/assistent/")({
  head: () =>
    pageHead(
      "AI Agent – Gespräche",
      "Mit dem ParkPulse AI Agent fiktive Parkangebote vergleichen und bestätigte Demo-Reservierungen durchführen.",
    ),
  component: AgentPage,
});
