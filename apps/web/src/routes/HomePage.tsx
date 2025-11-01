import { StatusCard } from '@fsm/ui-web';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-widest text-emerald-400">
          FSM Unified Platform
        </p>
        <h1 className="text-3xl font-semibold sm:text-4xl">Technician productivity cockpit</h1>
        <p className="text-base text-slate-300">
          Access calculators, diagnostics, and AI assistants from a shared workspace with Supabase at
          the core. Navigate using the sidebar to launch specific tools or view reporting dashboards.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatusCard tone="success" title="Calc module">
          <p className="text-sm text-slate-200">
            Airflow, duct sizing, filter selection, and Manual J estimators now live under the Calculators
            section with shared persistence and Supabase logging.
          </p>
        </StatusCard>
        <StatusCard tone="info" title="AI telemetry">
          <p className="text-sm text-slate-200">
            Reporting views summarise token usage, costs, and tool health in Supabase. Connect BI clients to
            the new views for dashboards.
          </p>
        </StatusCard>
      </div>
    </div>
  );
}
