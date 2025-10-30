# Supabase Infrastructure

This directory houses database migrations, seeds, and edge functions for the FSM Unified Platform.

- `migrations/` contains ordered SQL files generated via Supabase CLI.
- `functions/` contains edge functions (Deno) deployed to Supabase.

Run `supabase db diff` and `supabase db push` from the repository root after authenticating with `supabase login`.
