# Supabase Local Development

1. Install Supabase CLI (`npm install -g supabase`).
2. Run `supabase init` if first time (project ID stored in `supabase/config.toml`).
3. Start local stack: `supabase start`.
4. Apply migrations: `supabase db push`.
5. Generate types: `supabase gen types typescript --linked > packages/types/src/generated.ts` (integrate into build pipeline).
6. Seed demo data with scripts imported from legacy repositories.
