import type { ReactNode } from 'react';
import type { CalculatorRun } from '../hooks/useCalculatorHistory';

interface HistoryTimelineProps<TInput, TResult> {
  runs: CalculatorRun<TInput, TResult>[];
  formatter: (run: CalculatorRun<TInput, TResult>) => ReactNode;
  emptyMessage?: string;
}

export function HistoryTimeline<TInput, TResult>({
  runs,
  formatter,
  emptyMessage = 'No history logged yet.',
}: HistoryTimelineProps<TInput, TResult>) {
  if (!runs.length) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4 text-sm text-slate-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {runs.map((run) => (
        <li
          key={run.id}
          className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200"
        >
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
            <span>{new Date(run.createdAt).toLocaleString()}</span>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
              {run.source === 'remote' ? 'Supabase' : 'Local'}
            </span>
          </div>
          <div className="mt-2 text-sm text-slate-100">{formatter(run)}</div>
          {run.notes && <p className="mt-2 text-xs text-slate-400">Notes: {run.notes}</p>}
        </li>
      ))}
    </ul>
  );
}
