-- Seed baseline AI assistants, sessions, and usage telemetry

WITH inserted_assistant AS (
  INSERT INTO public.ai_assistants (id, name, description, provider, model, instructions, tags, metadata)
  VALUES (
    '2e7e3a62-9f2e-4b13-8c6a-6cb6a53876d3',
    'Ops Copilot',
    'Default assistant for scheduling, diagnostics summarization, and knowledge lookups.',
    'anthropic',
    'claude-3-5-sonnet',
    'Support technicians with job scheduling context, HVAC diagnostics, and inventory insights.',
    ARRAY['default','ops','scheduling'],
    jsonb_build_object(
      'temperature', 0.3,
      'max_context_tokens', 160000
    )
  )
  ON CONFLICT (id) DO UPDATE
  SET
    description = EXCLUDED.description,
    instructions = EXCLUDED.instructions,
    tags = EXCLUDED.tags,
    metadata = EXCLUDED.metadata
  RETURNING id
),
first_profile AS (
  SELECT id FROM public.profiles ORDER BY created_at ASC LIMIT 1
),
inserted_session AS (
  INSERT INTO public.ai_sessions (assistant_id, title, status, metadata, created_by)
  SELECT ia.id, 'Initial Ops Runbook Session', 'active', jsonb_build_object('seeded', true), fp.id
  FROM inserted_assistant ia
  JOIN first_profile fp ON fp.id IS NOT NULL
  ON CONFLICT DO NOTHING
  RETURNING id, assistant_id
)
INSERT INTO public.ai_session_participants (session_id, profile_id, role, invited_by)
SELECT isess.id, fp.id, 'owner', fp.id
FROM inserted_session isess
JOIN first_profile fp ON fp.id IS NOT NULL
ON CONFLICT DO NOTHING;

INSERT INTO public.ai_usage_events (
  id,
  assistant_id,
  provider,
  model,
  status,
  prompt_tokens,
  completion_tokens,
  duration_ms,
  cost_cents,
  metadata
)
VALUES (
  '63837543-0f53-4620-913c-77cb8fbf12b1',
  '2e7e3a62-9f2e-4b13-8c6a-6cb6a53876d3',
  'anthropic',
  'claude-3-5-sonnet',
  'succeeded',
  850,
  320,
  920,
  3.45,
  jsonb_build_object('seeded', true)
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.ai_tool_invocations (
  id,
  assistant_id,
  tool_name,
  status,
  input,
  output,
  started_at,
  completed_at
)
VALUES (
  '58c0ea46-69c4-4d36-a4ad-4a2bc058dab3',
  '2e7e3a62-9f2e-4b13-8c6a-6cb6a53876d3',
  'generate_work_order',
  'succeeded',
  jsonb_build_object('job_id', 'seed-demo-job', 'priority', 'high'),
  jsonb_build_object('work_order_id', 'WO-1001', 'status', 'draft'),
  now() - interval '2 minutes',
  now() - interval '1 minute'
)
ON CONFLICT (id) DO NOTHING;
