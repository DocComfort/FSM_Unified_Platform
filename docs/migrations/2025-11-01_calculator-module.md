# Calculator Module Scaffold - Nov 1, 2025

- Added new package `@fsm/calculators` containing reusable HVAC calculator logic starting with the airflow/static pressure predictor (ported from BOLT FSM).
- Functions expose pure TypeScript utilities for reuse across web and mobile applications.
- Added duct sizing, filter performance, and Manual J load helpers with matching Vitest coverage.
- Established the `@fsm/calculators` test harness (`vitest.config.ts`) and wired it into the turbo test pipeline.
- Dedicated calculator routes/screens now live in `apps/web` and `apps/mobile`, persisting history locally and (when authenticated) to Supabase.
- Next: expand coverage for edge cases (extreme velocities, filter datasets) and surface shared components in UI packages.
