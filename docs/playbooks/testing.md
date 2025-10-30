# Testing Playbook

| Scope        | Tooling                                | Notes                                               |
| ------------ | -------------------------------------- | --------------------------------------------------- |
| Shared logic | `turbo run test --filter=@fsm/core`    | Vitest coverage for services.                       |
| Web UI       | `npm run test -- --filter=@fsm/web`    | Vitest + Testing Library, covers routing and forms. |
| Mobile       | `npm run test -- --filter=@fsm/mobile` | Configure Jest/Expo, Detox for E2E.                 |
| Database     | `supabase db test`                     | pgTAP suites validating RLS, triggers, functions.   |

Automate the matrix via CI (GitHub Actions) with caching keyed on `package-lock.json`. Treat security scans (`npm audit`, `npx supabase lint`) as required checks before merge.
