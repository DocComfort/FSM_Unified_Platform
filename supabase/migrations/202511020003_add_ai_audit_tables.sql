-- AI Assistant Audit + Collaboration Tables (Docs-Fantastic merge)
-- Captures usage telemetry, feedback, tool invocation logs, and multi-participant sessions.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'ai_participant_role'
  ) THEN
    CREATE TYPE ai_participant_role AS ENUM ('owner', 'collaborator', 'viewer');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'ai_tool_status'
  ) THEN
    CREATE TYPE ai_tool_status AS ENUM ('queued', 'running', 'succeeded', 'failed');
  END IF;
END $$;

-- Session participants (shared conversations)
CREATE TABLE IF NOT EXISTS public.ai_session_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.ai_sessions(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role ai_participant_role NOT NULL DEFAULT 'collaborator',
  invited_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_session_participants_unique
  ON public.ai_session_participants(session_id, profile_id);
CREATE INDEX IF NOT EXISTS idx_ai_session_participants_session
  ON public.ai_session_participants(session_id);

ALTER TABLE public.ai_session_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "AI session participants readable" ON public.ai_session_participants;
CREATE POLICY "AI session participants readable" ON public.ai_session_participants
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.ai_sessions s
      WHERE s.id = session_id
        AND (
          s.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('admin', 'manager')
          )
        )
    )
  );

DROP POLICY IF EXISTS "AI session participants manage" ON public.ai_session_participants;
CREATE POLICY "AI session participants manage" ON public.ai_session_participants
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.ai_sessions s
      WHERE s.id = session_id
        AND (
          s.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.ai_session_participants sp
            WHERE sp.session_id = session_id
              AND sp.profile_id = auth.uid()
              AND sp.role = 'owner'
          )
          OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('admin', 'manager')
          )
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.ai_sessions s
      WHERE s.id = session_id
        AND (
          s.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.ai_session_participants sp
            WHERE sp.session_id = session_id
              AND sp.profile_id = auth.uid()
              AND sp.role IN ('owner', 'collaborator')
          )
          OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('admin', 'manager')
          )
        )
    )
  );

-- Message feedback (quality ratings + coaching notes)
CREATE TABLE IF NOT EXISTS public.ai_message_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES public.ai_messages(id) ON DELETE CASCADE,
  rating smallint CHECK (rating BETWEEN -1 AND 5),
  label text,
  comment text,
  created_by uuid NOT NULL REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_message_feedback_message ON public.ai_message_feedback(message_id);
CREATE INDEX IF NOT EXISTS idx_ai_message_feedback_created_by ON public.ai_message_feedback(created_by);

ALTER TABLE public.ai_message_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "AI message feedback readable" ON public.ai_message_feedback;
CREATE POLICY "AI message feedback readable" ON public.ai_message_feedback
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.ai_messages m
      WHERE m.id = message_id
        AND (
          EXISTS (
            SELECT 1
            FROM public.ai_sessions s
            WHERE s.id = m.session_id
              AND (
                s.created_by = auth.uid()
                OR EXISTS (
                  SELECT 1
                  FROM public.ai_session_participants sp
                  WHERE sp.session_id = s.id AND sp.profile_id = auth.uid()
                )
                OR EXISTS (
                  SELECT 1 FROM public.profiles p
                  WHERE p.id = auth.uid() AND p.role IN ('admin', 'manager')
                )
              )
          )
        )
    )
  );

DROP POLICY IF EXISTS "AI message feedback manage" ON public.ai_message_feedback;
CREATE POLICY "AI message feedback manage" ON public.ai_message_feedback
  FOR ALL TO authenticated
  USING (created_by = auth.uid() OR auth.role() = 'service_role')
  WITH CHECK (created_by = auth.uid() OR auth.role() = 'service_role');

-- Tool invocation logs for function calling and external automations
CREATE TABLE IF NOT EXISTS public.ai_tool_invocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES public.ai_messages(id) ON DELETE SET NULL,
  assistant_id uuid REFERENCES public.ai_assistants(id) ON DELETE SET NULL,
  tool_name text NOT NULL,
  status ai_tool_status DEFAULT 'queued',
  input jsonb DEFAULT '{}',
  output jsonb,
  error text,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_ai_tool_invocations_assistant ON public.ai_tool_invocations(assistant_id);
CREATE INDEX IF NOT EXISTS idx_ai_tool_invocations_status ON public.ai_tool_invocations(status);

ALTER TABLE public.ai_tool_invocations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "AI tool invocations readable" ON public.ai_tool_invocations;
CREATE POLICY "AI tool invocations readable" ON public.ai_tool_invocations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'manager')
    )
    OR auth.role() = 'service_role'
  );

DROP POLICY IF EXISTS "AI tool invocations manage" ON public.ai_tool_invocations;
CREATE POLICY "AI tool invocations manage" ON public.ai_tool_invocations
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'manager')
    )
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'manager')
    )
    OR auth.role() = 'service_role'
  );

-- Usage telemetry (billing, monitoring, analytics)
CREATE TABLE IF NOT EXISTS public.ai_usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_id uuid REFERENCES public.ai_assistants(id) ON DELETE SET NULL,
  session_id uuid REFERENCES public.ai_sessions(id) ON DELETE SET NULL,
  message_id uuid REFERENCES public.ai_messages(id) ON DELETE SET NULL,
  provider text NOT NULL,
  model text NOT NULL,
  status text DEFAULT 'succeeded',
  prompt_tokens integer DEFAULT 0,
  completion_tokens integer DEFAULT 0,
  total_tokens integer GENERATED ALWAYS AS (prompt_tokens + completion_tokens) STORED,
  duration_ms integer,
  cost_cents numeric(10,4),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_events_assistant ON public.ai_usage_events(assistant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_events_session ON public.ai_usage_events(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_events_provider ON public.ai_usage_events(provider, model);

ALTER TABLE public.ai_usage_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "AI usage events readable" ON public.ai_usage_events;
CREATE POLICY "AI usage events readable" ON public.ai_usage_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'manager')
    )
    OR auth.role() = 'service_role'
  );

DROP POLICY IF EXISTS "AI usage events manage" ON public.ai_usage_events;
CREATE POLICY "AI usage events manage" ON public.ai_usage_events
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'manager')
    )
    OR auth.role() = 'service_role'
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'manager')
    )
    OR auth.role() = 'service_role'
  );

COMMENT ON TABLE public.ai_session_participants IS 'Shared access mapping for AI sessions, migrated from Docs-Fantastic collaboration module.';
COMMENT ON TABLE public.ai_message_feedback IS 'User feedback records for AI responses, including quality ratings and coaching notes.';
COMMENT ON TABLE public.ai_tool_invocations IS 'Edge function + AI tool invocation log for debugging function calls.';
COMMENT ON TABLE public.ai_usage_events IS 'Billing and analytics telemetry for AI runs (tokens, costs, performance).';
