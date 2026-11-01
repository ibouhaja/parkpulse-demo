import { createFileRoute } from "@tanstack/react-router";
import { AgentPage } from "@/features/parkpulse/agent-chat";
import { pageHead } from "@/features/parkpulse/shared";
export const Route = createFileRoute("/_authenticated/assistent/$threadId")({
  head: () =>
    pageHead(
      "AI Agent – Parkplatzgespräch",
      "Persönliches ParkPulse-Agentengespräch mit echten Werkzeugaufrufen und fiktiven Parkplatzangeboten.",
    ),
  component: AgentThreadPage,
});
function AgentThreadPage() {
  const { threadId } = Route.useParams();
  return <AgentPage key={threadId} threadId={threadId} />;
}
