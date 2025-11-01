BEGIN;

SELECT plan(6);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'ai_session_participants'
      AND policyname = 'AI session participants readable'
  ),
  'ai_session_participants readable policy exists'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'ai_tool_invocations'
      AND policyname = 'AI tool invocations readable'
  ),
  'ai_tool_invocations readable policy exists'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'ai_usage_events'
      AND policyname = 'AI usage events readable'
  ),
  'ai_usage_events readable policy exists'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'calculator_run_history'
      AND policyname = 'Calculator history readable'
  ),
  'calculator_run_history readable policy exists'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'calculator_run_history'
      AND policyname = 'Calculator history insert'
  ),
  'calculator_run_history insert policy exists'
);

SELECT ok(
  EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'calculator_run_history'
      AND policyname = 'Calculator history service access'
  ),
  'calculator_run_history service access policy exists'
);

SELECT finish();

ROLLBACK;
