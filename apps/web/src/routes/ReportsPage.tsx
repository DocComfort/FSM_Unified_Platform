import { StatusCard } from '@fsm/ui-web';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold text-slate-100">AI Reporting</h2>
        <p className="text-sm text-slate-400">
          Supabase views aggregate token consumption, tool health, and response latency metrics. Connect BI
          tools or Supabase dashboards to visualise trends.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <StatusCard tone="info" title="Daily usage view">
          <p className="text-sm text-slate-200">
            Query <code className="font-mono text-xs">ai_usage_daily_metrics</code> to review tokens,
            invocation counts, and average latency per provider/model.
          </p>
        </StatusCard>
        <StatusCard tone="warning" title="Tool health view">
          <p className="text-sm text-slate-200">
            <code className="font-mono text-xs">ai_tool_status_summary</code> surfaces function-call success
            rates. Filter by <span className="font-semibold">status</span> to catch failing webhooks quickly.
          </p>
        </StatusCard>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-300">
        <p>
          Tip: wire these views into Supabase Visualiser, Metabase, or Power BI. They refresh automatically as
          new usage events and tool invocations stream into the platform.
        </p>
      </div>
    </div>
  );
}
