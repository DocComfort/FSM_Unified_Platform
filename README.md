# FSM Unified Platform

A consolidated monorepo for Doc Comfort's Field Service Management suite. This workspace merges the strongest capabilities from the HVAC Pro, Docs-Fantastic, BOLT calculators, and FSM mobile codebases into a single Supabase-backed platform that targets web, mobile, and edge environments.

## Monorepo Structure

- `apps/web` - Vite + React + Tailwind web client scaffolded for dashboard and PWA parity.
- `apps/mobile` - Expo Router + React Native shell prepared for offline sync and technician workflows.
- `packages/config` - Shared linting, formatting, and tooling presets.
- `packages/types` - Canonical TypeScript models generated from the unified schema.
- `packages/core` - Supabase service layer and shared data access logic.
- `packages/ui-web` - Web component kit with Tailwind-friendly primitives.
- `packages/ui-native` - React Native UI primitives aligned with mobile theming.
- `packages/calculators` - Cross-platform HVAC calculators (airflow, duct, filter, Manual J) shared by web and mobile apps.
- `supabase` - Database migrations, edge functions, and environment configuration.
- `docs` - Developer onboarding, ADRs, schema diagrams, and feature guides.

## Getting Started

```bash
# Install dependencies
npm install

# Start web dev server
npm run dev -- --filter=@fsm/web

# Start Expo dev server for mobile
npm run dev -- --filter=@fsm/mobile
```

## Required Tooling

- Node.js 20+
- npm 10+
- Supabase CLI (for migrations and local development)
- Expo CLI (bundled with `npx expo` commands)

## Environment Variables

Create a `.env` (web) and `apps/mobile/.env` (Expo) based on `.env.example`:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## Feature Highlights

- Web calculators live under `/calculators/*` with dedicated routes, persisted history, and Supabase sync when authenticated.
- Mobile technicians launch identical calculators from Expo Router screens; local runs auto-sync once online.
- Supabase now tracks calculator history (`calculator_run_history`) and AI telemetry views (`ai_usage_daily_metrics`, `ai_tool_status_summary`).
- pgTAP assertions guard AI + calculator RLS policies (`supabase/tests/ai_policies.sql`).

## Next Steps

1. **Authentication Bridge** - wire Supabase auth UX so technicians sign in before logging calculator runs (enables cross-device history).
2. **Data Visualisation** - build dashboards or charts on top of `ai_usage_daily_metrics` and `ai_tool_status_summary` within the web app.
3. **Offline Enhancements** - add background sync/retry for calculator history on mobile when connectivity returns.
4. **Automated QA** - extend pgTAP to cover insert/update scenarios and add Vitest coverage around the new persistence hooks.

Track progress and architecture decisions in `docs/`. Use `turbo run lint|test|build` to execute commands across the workspace.
