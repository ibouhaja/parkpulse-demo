import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
export const agentThreads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("agent_threads")
      .select("id,title,updated_at")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error("Gespräche konnten nicht geladen werden.");
    return data;
  });
export const agentThread = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator(z.object({ id: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const { data: row, error } = await context.supabase
      .from("agent_threads")
      .select("id,title,messages,version,run_id,run_started_at")
      .eq("user_id", context.userId)
      .eq("id", data.id)
      .single();
    if (error) throw new Error("Gespräch nicht gefunden.");
    return row;
  });
export const newAgentThread = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("agent_threads")
      .insert({ user_id: context.userId })
      .select("id")
      .single();
    if (error) throw new Error("Gespräch konnte nicht erstellt werden.");
    return data;
  });
