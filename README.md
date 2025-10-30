# FSM Unified Platform

A consolidated monorepo for Doc Comfort's Field Service Management suite. This workspace merges the strongest capabilities from the HVAC Pro, Docs-Fantastic, BOLT calculators, and FSM mobile codebases into a single Supabase-backed platform that targets web, mobile, and edge environments.

## Monorepo Structure

- `apps/web` – Vite + React + Tailwind web client scaffolded for dashboard and PWA parity.
- `apps/mobile` – Expo Router + React Native shell prepared for offline sync and technician workflows.
- `packages/config` – Shared linting, formatting, and tooling presets.
- `packages/types` – Canonical TypeScript models generated from the unified schema.
- `packages/core` – Supabase service layer and shared data access logic.
- `packages/ui-web` – Web component kit with Tailwind-friendly primitives.
- `packages/ui-native` – React Native UI primitives aligned with mobile theming.
- `supabase` – Database migrations, edge functions, and environment configuration.
- `docs` – Developer onboarding, ADRs, schema diagrams, and feature guides.

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

## Next Steps

1. **Schema Merge** – import baseline SQL from HVAC Pro and Docs-Fantastic into `supabase/migrations` and wire automated type generation.
2. **Auth & Session Bridge** – port the existing Supabase auth context to `packages/core` and share between web/mobile.
3. **Feature Migration** – incrementally merge calculators, diagnostics, offline sync, and Twilio edge functions into shared packages.
4. **Testing & QA** – configure Vitest (web) and Jest/Expo (mobile) suites alongside Supabase pgTAP policies.

Track progress and architecture decisions in `docs/`. Use `turbo run lint|test|build` to execute commands across the workspace.
