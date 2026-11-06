import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Plus, MessageSquare, ArrowRight, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { agentThread, agentThreads, newAgentThread } from "./agent.functions";
import { useDemo } from "./store";
import { supabase } from "@/integrations/supabase/client";
import { money, facilities } from "./data";
import type { AgentOffer } from "./agent-rules";
import { CancellationTerms } from "./cancellation-ui";
import type { CancellationQuote, CancellationBatchQuote, RescheduleOffer } from "./cancellation-rules";
import { useI18n } from "./i18n";
import agentLogo from "@/assets/parkpulse-agent.jpg";

const labels: Record<string, string> = {
  meine_reservierungen: "Eigene Reservierungen prüfen",
  stornierung_pruefen: "Stornierungsgebühr prüfen",
  demo_stornieren: "Bestätigte Demo-Stornierung",
  stornierungen_pruefen: "Stornogebühren prüfen",
  demo_stornierungen_ausfuehren: "Bestätigte Demo-Stornierung",
  verschiebung_pruefen: "Verschiebung prüfen",
  demo_verschieben: "Bestätigte Verschiebung",
  parkplatzsuche: "Parkhäuser suchen",
  fahrzeugkompatibilitaet: "Fahrzeug und Ausstattung prüfen",
  verfuegbarkeit: "Demo-Verfügbarkeit prüfen",
  preisberechnung: "Tarif und Budget prüfen",
  punkteberechnung: "Mögliche Punkte berechnen",
  angebote_vergleichen: "Beste Angebote vergleichen",
  demo_reservieren: "Bestätigte Demo-Reservierung",
  reservierungsstatus: "Reservierungsstatus zurücklesen",
};
export function AgentPage({ threadId }: { threadId?: string }) {
  const { userId } = useDemo();
  const { t } = useI18n();
  const list = useServerFn(agentThreads);
  const get = useServerFn(agentThread);
  const create = useServerFn(newAgentThread);
  const qc = useQueryClient();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const threads = useQuery({ queryKey: ["agent-threads", userId], queryFn: () => list() });
  const current = useQuery({
    queryKey: ["agent-thread", userId, threadId],
    queryFn: () => get({ data: { id: threadId ?? "" } }),
    enabled: !!threadId,
    staleTime: 60000,
  });
  const newThread = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const row = await create();
      qc.setQueryData(["agent-thread", userId, row.id], {
        id: row.id,
        title: "Neues Gespräch",
        messages: [],
        version: 0,
        run_id: null,
        run_started_at: null,
      });
      await qc.invalidateQueries({ queryKey: ["agent-threads", userId] });
      window.location.assign(`/assistent/${row.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("Gespräch konnte nicht geöffnet werden."));
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <div className="agent-heading">
        <img src={agentLogo} width={52} height={52} alt="ParkPulse AI Agent" />
        <div>
          <div className="eyebrow">DEIN PARKPULSE</div>
          <h1>ParkPulse AI Agent</h1>
        </div>
        <span className="demo-pill">{t("ECHTE KI · DEMO-PARKDATEN")}</span>
      </div>
      <div className="agent-workspace">
        <aside className="agent-threads">
          <Button onClick={() => void newThread()} disabled={busy}>
            <Plus />
            {t("Neues Gespräch")}
          </Button>
          <nav aria-label={t("Gespräche")}>
            {threads.data?.map((t) => (
              <Button key={t.id} variant={t.id === threadId ? "secondary" : "ghost"} asChild>
                <Link to="/assistent/$threadId" params={{ threadId: t.id }}>
                  <MessageSquare />
                  <span>{t.title}</span>
                </Link>
              </Button>
            ))}
          </nav>
        </aside>
        <section className="agent-main">
          {error && (
            <p role="alert" className="text-destructive">
              {error}
            </p>
          )}
          {!threadId ? (
            <div className="agent-empty">
              <img src={agentLogo} width={80} height={80} alt="" />
              <h2>{t("Wo möchtest du parken?")}</h2>
              <Button onClick={() => void newThread()} disabled={busy}>
                {t("Gespräch beginnen")}
                <ArrowRight />
              </Button>
            </div>
          ) : current.isPending ? (
            <Shimmer>{t("Gespräch wird geladen …")}</Shimmer>
          ) : current.error ? (
            <p role="alert">{current.error.message}</p>
          ) : (
            current.data && (
              <AgentWindow
                key={`${userId}:${threadId}`}
                threadId={threadId}
                initialMessages={current.data.messages as unknown as UIMessage[]}
                locked={!!current.data.run_id}
              />
            )
          )}
        </section>
      </div>
    </>
  );
}
function AgentWindow({
  threadId,
  initialMessages,
  locked,
}: {
  threadId: string;
  initialMessages: UIMessage[];
  locked: boolean;
}) {
  const { userId } = useDemo();
  const qc = useQueryClient();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [localError, setLocalError] = useState("");
  const inFlight = useRef(false);
  const [transport] = useState(
    () =>
      new DefaultChatTransport({
        api: "/api/public/agent",
        body: { threadId },
        headers: async () => {
          const { data } = await supabase.auth.getSession();
          return data.session
            ? { Authorization: `Bearer ${data.session.access_token}` }
            : { Authorization: "" };
        },
      }),
  );
  const { messages, sendMessage, status, error, stop } = useChat({
    id: threadId,
    messages: initialMessages,
    transport,
    onFinish: () => {
      inFlight.current = false;
      void qc.invalidateQueries({ queryKey: ["agent-threads", userId] });
      void qc.invalidateQueries({ queryKey: ["demo-reservations"] });
      void qc.invalidateQueries({ queryKey: ["demo-held"] });
      textarea.current?.focus();
    },
    onError: () => {
      inFlight.current = false;
      textarea.current?.focus();
    },
  });
  const busy = status === "submitted" || status === "streaming";
  useEffect(() => {
    if (!busy) textarea.current?.focus();
  }, [busy, threadId]);
  const send = async (text: string, confirmationId?: string, cancellationConfirmationId?: string, extra: Record<string, string> = {}) => {
    if (inFlight.current || busy || locked) return;
    inFlight.current = true;
    setLocalError("");
    try {
      await sendMessage(
        { text },
        { body: { threadId, ...(confirmationId ? {confirmationId} : {}), ...(cancellationConfirmationId ? {cancellationConfirmationId} : {}), ...extra } },
      );
      setInput("");
    } catch (e) {
      inFlight.current = false;
      setLocalError(e instanceof Error ? e.message : "Nachricht konnte nicht gesendet werden.");
    }
    textarea.current?.focus();
  };
  const [dismissedQuotes,setDismissedQuotes]=useState<string[]>([]);
  const booked = new Set(
    messages.flatMap((m) =>
      m.parts.flatMap((p) =>
        p.type === "dynamic-tool" &&
        p.toolName === "reservierungsstatus" &&
        p.state === "output-available" &&
        typeof p.output === "object" &&
        p.output !== null &&
        "id" in p.output
          ? [String(p.output.id)]
          : [],
      ),
    ),
  );
  return (
    <>
      <Conversation className="agent-conversation">
        <ConversationContent>
          {messages.length === 0 && (
            <div className="agent-empty">
              <img src={agentLogo} width={64} height={64} alt="" />
              <h2>Hallo, ich bin dein ParkPulse Agent.</h2>
              <p>Was brauchst du für deinen nächsten Parkplatz?</p>
            </div>
          )}
          {messages.map((m) => (
            <Message key={m.id} from={m.role}>
              <MessageContent>
                {m.parts.map((p, i) =>
                  p.type === "text" ? (
                    <MessageResponse key={i}>{p.text}</MessageResponse>
                  ) : p.type === "dynamic-tool" ? (
                    <div key={p.toolCallId} className="agent-tool-result">
                      <Tool defaultOpen={false}>
                        <ToolHeader
                          type="dynamic-tool"
                          toolName={p.toolName}
                          title={labels[p.toolName] ?? p.toolName}
                          state={p.state}
                        />
                        <ToolContent>
                          <ToolInput input={p.input} />
                          <ToolOutput
                            output={p.state === "output-available" ? p.output : undefined}
                            errorText={p.state === "output-error" ? p.errorText : undefined}
                          />
                        </ToolContent>
                      </Tool>
                      {p.toolName === "angebote_vergleichen" &&
                        p.state === "output-available" &&
                        Array.isArray(p.output) && (
                          <div className="agent-offers">
                            {(p.output as AgentOffer[]).map((o, index) => (
                              <article className="agent-offer" key={o.id}>
                                <div className="agent-offer-title">
                                  <span>{index + 1}</span>
                                  <h3>{o.name}</h3>
                                </div>
                                <strong className="agent-offer-price">
                                  {money(o.price)} <small>für {o.hours} Stunden</small>
                                </strong>
                                <p>
                                  <MapPin size={14} />
                                  {o.distance.toLocaleString("de-DE")} km · Demo-Entfernung
                                </p>
                                <p>
                                  {o.equipment.join(" · ") || "Standardstellplatz"} · {o.available}{" "}
                                  passende freie Plätze
                                </p>
                                <p>
                                  {o.points.toLocaleString("de-DE")} mögliche Punkte bei positiver
                                  Zahlung ohne Gutschein
                                </p>
                                <p>
                                  {new Date(o.startsAt).toLocaleString("de-DE", {
                                    timeZone: "Europe/Berlin",
                                  })}{" "}
                                  · {o.level} / {o.bay}
                                </p>
                                <CancellationTerms/>
                                <Button
                                  disabled={
                                    busy || locked || booked.has(o.id) || Date.now() > o.expiresAt
                                  }
                                  onClick={() =>
                                    void send(
                                      `Ich bestätige ausdrücklich die Demo-Reservierung: ${o.name}, ${o.level}/${o.bay}, ${new Date(o.startsAt).toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}, ${o.hours} Stunden für ${money(o.price)}.`,
                                      o.id,
                                    )
                                  }
                                >
                                  {booked.has(o.id) ? (
                                    <>
                                      <Check />
                                      Reservierungsstatus geprüft
                                    </>
                                  ) : (
                                    "Demo-Reservierung bestätigen"
                                  )}
                                </Button>
                              </article>
                            ))}
                          </div>
                        )}
                      {p.toolName === 'stornierung_pruefen' && p.state === 'output-available' && p.output !== null && typeof p.output === 'object' && (()=>{
                        const q=p.output as CancellationQuote;
                        return <div className="space-y-3 py-3"><p>Parkpreis vor Punkten/Gutscheinen: {money(q.price)}</p><p>Simulierte Stornierungsgebühr ({q.percent} %): <strong>{money(q.feeCents/100)}</strong></p><CancellationTerms/><div className="flex flex-wrap gap-2"><Button disabled={busy||locked||dismissedQuotes.includes(q.id)||Date.now()>q.expiresAt} onClick={()=>{setDismissedQuotes(v=>[...v,q.id]);void send(`Ich bestätige ausdrücklich die Demo-Stornierung der Reservierung ${q.reservationId} für ${money(q.feeCents/100)} simulierte Gebühr.`,undefined,q.id);}}>Stornierung bestätigen · {money(q.feeCents/100)} (Demo)</Button><Button variant="outline" disabled={busy||dismissedQuotes.includes(q.id)} onClick={()=>setDismissedQuotes(v=>[...v,q.id])}>Abbrechen</Button></div></div>;
                      })()}
                      {p.toolName === 'stornierungen_pruefen' && p.state === 'output-available' && p.output !== null && typeof p.output === 'object' && (()=>{
                        const q=p.output as CancellationBatchQuote;
                        const done=dismissedQuotes.includes(q.batchId);
                        return <div className="agent-batch" data-testid="cancel-batch">
                          <ul>{q.items.map(i=><li key={i.id}><span><strong>{facilityName(i.facilityId)}</strong> · {i.level}/{i.bay}<br/><small>{when(i.startsAt)} · {i.hours} Std. · Preis {money(i.price)}</small></span><span>{i.percent===0?'kostenlos':`${i.percent} %`} · <strong>{money(i.feeCents/100)}</strong></span></li>)}</ul>
                          <p className="agent-batch-total">Gesamte simulierte Stornogebühr: <strong>{money(q.totalFeeCents/100)}</strong></p>
                          <p>Möchtest du {q.items.length===1?'diese Reservierung':`diese ${q.items.length} Reservierungen`} wirklich stornieren?</p>
                          <div className="flex flex-wrap gap-2"><Button disabled={busy||locked||done||Date.now()>q.expiresAt} onClick={()=>{setDismissedQuotes(v=>[...v,q.batchId]);void send(`Ich bestätige ausdrücklich die Demo-Stornierung von ${q.items.length} Reservierung(en) für insgesamt ${money(q.totalFeeCents/100)} simulierte Gebühr.`,undefined,undefined,{batchConfirmationId:q.batchId});}}>Ja, stornieren · {money(q.totalFeeCents/100)} (Demo)</Button><Button variant="outline" disabled={busy||done} onClick={()=>setDismissedQuotes(v=>[...v,q.batchId])}>Abbrechen</Button></div>
                          {Date.now()>q.expiresAt&&!done&&<small>Vorschau abgelaufen – bitte den Agenten erneut fragen.</small>}
                        </div>;
                      })()}
                      {p.toolName === 'verschiebung_pruefen' && p.state === 'output-available' && p.output !== null && typeof p.output === 'object' && (()=>{
                        const o=p.output as RescheduleOffer; const fee=o.cancellation.totalFeeCents; const done=dismissedQuotes.includes(o.id);
                        return <div className="agent-batch" data-testid="reschedule-offer">
                          <p>Neu: <strong>{facilityName(o.facility)}</strong> · {o.level}/{o.bay} · {when(o.startsAt)} · {o.hours} Std. · {money(o.price)}</p>
                          <p>Stornogebühr der alten Reservierung ({o.cancellation.items[0]?.percent ?? 0} %): <strong>{money(fee/100)}</strong></p>
                          <p className="agent-batch-total">Gesamt (Demo): <strong>{money(o.price+fee/100)}</strong></p>
                          <div className="flex flex-wrap gap-2"><Button disabled={busy||locked||done||Date.now()>o.expiresAt} onClick={()=>{setDismissedQuotes(v=>[...v,o.id]);void send(`Ich bestätige ausdrücklich die Demo-Verschiebung auf ${when(o.startsAt)} (${o.level}/${o.bay}) für ${money(o.price)} plus ${money(fee/100)} Stornogebühr.`,undefined,undefined,{rescheduleConfirmationId:o.id});}}>Verschiebung bestätigen (Demo)</Button><Button variant="outline" disabled={busy||done} onClick={()=>setDismissedQuotes(v=>[...v,o.id])}>Abbrechen</Button></div>
                        </div>;
                      })()}
                      {p.toolName === "reservierungsstatus" && p.state === "output-available" && (
                        <Button asChild variant="outline">
                          <Link to="/reservierungen">
                            Meine Demo-Reservierungen
                            <ArrowRight />
                          </Link>
                        </Button>
                      )}
                    </div>
                  ) : null,
                )}
              </MessageContent>
            </Message>
          ))}
          {status === "submitted" && <Shimmer>Der Agent prüft deine Anfrage …</Shimmer>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      {(error || localError) && (
        <p role="alert" className="agent-error">
          {localError || error?.message}
        </p>
      )}
      {locked && (
        <p role="alert" className="agent-error">
          Die letzte Anfrage ist noch offen oder wurde unterbrochen. Bitte prüfe deine
          Reservierungen und beginne ein neues Gespräch.
        </p>
      )}
      <PromptInput className="agent-composer" onSubmit={({ text }) => send(text)}>
        <PromptInputTextarea
          ref={textarea}
          aria-label="Nachricht an ParkPulse AI Agent"
          placeholder="Frag ParkPulse, was ich für dich tun kann …"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={locked}
        />
        <PromptInputFooter className="justify-end">
          <PromptInputSubmit
            status={status}
            onStop={() => void stop()}
            aria-label={busy ? "Antwort stoppen" : "Nachricht senden"}
            disabled={locked || (!busy && !input.trim())}
          />
        </PromptInputFooter>
      </PromptInput>
    </>
  );
}

const facilityName=(id:string)=>facilities.find(f=>f.id===id)?.name??id;
const when=(iso:string)=>new Date(iso).toLocaleString("de-DE",{timeZone:"Europe/Berlin",dateStyle:"short",timeStyle:"short"});
