-- AI Assistant Schema
-- Introduces assistant configurations, conversation sessions, messages, knowledge documents, and async task queue.


DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'ai_task_status'
  ) THEN
    CREATE TYPE ai_task_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');
  END IF;
END $$;

-- Assistant catalog
CREATE TABLE IF NOT EXISTS public.ai_assistants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  provider text NOT NULL,
  model text NOT NULL,
  instructions text,
  temperature numeric(3,2) DEFAULT 0.5,
  top_p numeric(3,2) DEFAULT 1.0,
  max_output_tokens integer,
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_assistants_provider ON public.ai_assistants(provider);
CREATE INDEX IF NOT EXISTS idx_ai_assistants_tags ON public.ai_assistants USING gin(tags);

ALTER TABLE public.ai_assistants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "AI assistants readable" ON public.ai_assistants;
CREATE POLICY "AI assistants readable" ON public.ai_assistants
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "AI assistants manageable" ON public.ai_assistants;
CREATE POLICY "AI assistants manageable" ON public.ai_assistants
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin','manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin','manager')
    )
  );

CREATE TRIGGER ai_assistants_updated_at BEFORE UPDATE ON public.ai_assistants
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Conversation sessions
CREATE TABLE IF NOT EXISTS public.ai_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_id uuid REFERENCES public.ai_assistants(id) ON DELETE SET NULL,
  title text,
  status text DEFAULT 'active' CHECK (status IN ('active','archived','closed')),
  metadata jsonb DEFAULT '{}',
  created_by uuid NOT NULL REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_sessions_assistant ON public.ai_sessions(assistant_id);
CREATE INDEX IF NOT EXISTS idx_ai_sessions_created_by ON public.ai_sessions(created_by);

ALTER TABLE public.ai_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "AI sessions readable" ON public.ai_sessions;
CREATE POLICY "AI sessions readable" ON public.ai_sessions
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin','manager')
    )
  );

DROP POLICY IF EXISTS "AI sessions insert" ON public.ai_sessions;
CREATE POLICY "AI sessions insert" ON public.ai_sessions
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "AI sessions update" ON public.ai_sessions;
CREATE POLICY "AI sessions update" ON public.ai_sessions
  FOR UPDATE TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin','manager')
    )
  );

DROP POLICY IF EXISTS "AI sessions delete" ON public.ai_sessions;
CREATE POLICY "AI sessions delete" ON public.ai_sessions
  FOR DELETE TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin','manager')
    )
  );

CREATE TRIGGER ai_sessions_updated_at BEFORE UPDATE ON public.ai_sessions
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Messages
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.ai_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user','assistant','system','tool')),
  content text,
  token_count integer,
  provider_message_id text,
  error text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_session ON public.ai_messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_messages_role ON public.ai_messages(role);

ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "AI messages readable" ON public.ai_messages;
CREATE POLICY "AI messages readable" ON public.ai_messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_sessions s
      WHERE s.id = ai_messages.session_id
        AND (
          s.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('admin','manager')
          )
        )
    )
  );

DROP POLICY IF EXISTS "AI messages insert" ON public.ai_messages;
CREATE POLICY "AI messages insert" ON public.ai_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.ai_sessions s
      WHERE s.id = ai_messages.session_id
        AND (
          s.created_by = auth.uid()
          OR EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.role IN ('admin','manager')
          )
        )
    )
  );

-- Knowledge documents
CREATE TABLE IF NOT EXISTS public.ai_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  source text,
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_documents_tags ON public.ai_documents USING gin(tags);

ALTER TABLE public.ai_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "AI documents readable" ON public.ai_documents;
CREATE POLICY "AI documents readable" ON public.ai_documents
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "AI documents manageable" ON public.ai_documents;
CREATE POLICY "AI documents manageable" ON public.ai_documents
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin','manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin','manager')
    )
  );

CREATE TRIGGER ai_documents_updated_at BEFORE UPDATE ON public.ai_documents
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.ai_document_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.ai_documents(id) ON DELETE CASCADE,
  chunk_index integer NOT NULL,
  content text NOT NULL,
  embedding double precision[],
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_document_chunks_document ON public.ai_document_chunks(document_id, chunk_index);

ALTER TABLE public.ai_document_chunks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "AI document chunks readable" ON public.ai_document_chunks;
CREATE POLICY "AI document chunks readable" ON public.ai_document_chunks
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "AI document chunks manageable" ON public.ai_document_chunks;
CREATE POLICY "AI document chunks manageable" ON public.ai_document_chunks
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin','manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin','manager')
    )
  );

-- AI task queue
CREATE TABLE IF NOT EXISTS public.ai_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type text NOT NULL,
  status ai_task_status DEFAULT 'pending',
  priority integer DEFAULT 0,
  payload jsonb DEFAULT '{}',
  result jsonb,
  attempts integer DEFAULT 0,
  last_error text,
  scheduled_for timestamptz DEFAULT now(),
  processed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_tasks_status ON public.ai_tasks(status, scheduled_for);

ALTER TABLE public.ai_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "AI tasks manageable" ON public.ai_tasks;
CREATE POLICY "AI tasks manageable" ON public.ai_tasks
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin','manager')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin','manager')
    )
  );

CREATE TRIGGER ai_tasks_updated_at BEFORE UPDATE ON public.ai_tasks
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

COMMENT ON TABLE public.ai_assistants IS 'Configured AI assistants used across the platform.';
COMMENT ON TABLE public.ai_sessions IS 'Conversation sessions between technicians/customers and AI assistants.';
COMMENT ON TABLE public.ai_messages IS 'Messages exchanged within AI assistant sessions.';
COMMENT ON TABLE public.ai_documents IS 'Knowledge documents available for AI assistant grounding.';
COMMENT ON TABLE public.ai_document_chunks IS 'Chunked document embeddings for semantic search.';
COMMENT ON TABLE public.ai_tasks IS 'Background tasks for AI processing (embeddings, summarization, etc.).';
