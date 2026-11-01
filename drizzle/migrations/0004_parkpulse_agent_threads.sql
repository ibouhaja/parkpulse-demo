CREATE TABLE public.agent_threads (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, title text NOT NULL DEFAULT 'Neues Gespräch', messages jsonb NOT NULL DEFAULT '[]'::jsonb, version integer NOT NULL DEFAULT 0, run_id uuid, run_started_at timestamptz, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_threads TO authenticated;
GRANT ALL ON public.agent_threads TO service_role;
ALTER TABLE public.agent_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY agent_threads_read ON public.agent_threads FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY agent_threads_create ON public.agent_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND messages = '[]'::jsonb AND version = 0 AND run_id IS NULL);
CREATE POLICY agent_threads_delete ON public.agent_threads FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX agent_threads_owner ON public.agent_threads(user_id, updated_at DESC);