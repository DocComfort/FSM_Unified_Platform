import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { StatusCard } from '@fsm/ui-web';
import { calculateDuctSizing, type DuctSizingResult } from '@fsm/calculators';
import { HistoryTimeline } from '../../components/HistoryTimeline';
import { useCalculatorHistory } from '../../hooks/useCalculatorHistory';

interface DuctFormState {
  airflowCfm: number;
  straightLengthFeet: number;
  totalStaticPressure: number;
  desiredWidthInches?: number;
  targetVelocityFpm?: number;
}

const defaultDuctState: DuctFormState = {
  airflowCfm: 1400,
  straightLengthFeet: 65,
  totalStaticPressure: 0.8,
  desiredWidthInches: 18,
  targetVelocityFpm: 900,
};

export default function DuctCalculatorPage() {
  const [form, setForm] = useState<DuctFormState>(defaultDuctState);
  const [notes, setNotes] = useState('');
  const hydrated = useRef(false);

  const { history, saveRun } = useCalculatorHistory<DuctFormState, DuctSizingResult | null>('duct');

  useEffect(() => {
    if (hydrated.current) return;
    if (history.length && history[0]?.input) {
      setForm(history[0].input);
      hydrated.current = true;
    }
  }, [history]);

  const sizing = useMemo(
    () =>
      calculateDuctSizing({
        airflowCfm: form.airflowCfm,
        straightLengthFeet: form.straightLengthFeet,
        totalStaticPressure: form.totalStaticPressure,
        desiredWidthInches: form.desiredWidthInches,
        targetVelocityFpm: form.targetVelocityFpm,
      }),
    [form]
  );

  const handleChange =
    (key: keyof DuctFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setForm((prev) => ({ ...prev, [key]: Number.isFinite(value) ? value : prev[key] }));
    };

  const handleSaveRun = async () => {
    if (!sizing) return;
    await saveRun({ input: form, result: sizing, notes });
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-100">Duct sizing helper</h2>
        <p className="text-sm text-slate-400">
          Calculate round and rectangular duct recommendations with velocity and friction warnings.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <StatusCard tone="info" title="Input parameters">
          <div className="grid grid-cols-2 gap-3 text-slate-100">
            <LabeledNumber label="Airflow (CFM)" value={form.airflowCfm} onChange={handleChange('airflowCfm')} />
            <LabeledNumber
              label="Straight length (ft)"
              value={form.straightLengthFeet}
              onChange={handleChange('straightLengthFeet')}
            />
            <LabeledNumber
              label="Total static pressure"
              step={0.01}
              value={form.totalStaticPressure}
              onChange={handleChange('totalStaticPressure')}
            />
            <LabeledNumber
              label="Target velocity (FPM)"
              value={form.targetVelocityFpm ?? 0}
              onChange={handleChange('targetVelocityFpm')}
            />
            <LabeledNumber
              label="Desired width (in)"
              value={form.desiredWidthInches ?? 0}
              onChange={handleChange('desiredWidthInches')}
            />
          </div>

          <div className="mt-4 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-300">
              Notes
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="mt-1 h-20 w-full rounded-lg border border-sky-500/30 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                placeholder="Optional context for this run..."
              />
            </label>
            <button
              type="button"
              onClick={handleSaveRun}
              disabled={!sizing}
              className="inline-flex items-center justify-center rounded-lg border border-sky-500/60 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save run
            </button>
          </div>
        </StatusCard>

        <StatusCard tone="warning" title="Sizing result">
          {sizing ? (
            <div className="space-y-4 text-sm text-slate-200">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Round duct</p>
                <p className="text-lg font-semibold text-slate-100">{sizing.round.diameter}" diameter</p>
                <p className="text-xs text-slate-400">
                  {sizing.round.velocity.toFixed(0)} FPM • Friction {sizing.round.frictionRate.toFixed(3)} in/100ft
                </p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Rectangular duct</p>
                <p className="text-lg font-semibold text-slate-100">
                  {sizing.rectangular.width}" × {sizing.rectangular.height}"
                </p>
                <p className="text-xs text-slate-400">
                  {sizing.rectangular.velocity.toFixed(0)} FPM • AR {sizing.rectangular.aspectRatio.toFixed(1)}
                </p>
              </div>
              {sizing.warnings.length > 0 && (
                <ul className="list-disc space-y-1 rounded-lg border border-amber-500/30 bg-slate-950/60 px-4 py-3 text-xs text-amber-200">
                  {sizing.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Enter valid values to compute duct sizing.</p>
          )}
        </StatusCard>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-200">History</h3>
        <HistoryTimeline
          runs={history}
          formatter={(run) => (
            <div>
              <p className="font-semibold text-slate-100">
                {run.input.airflowCfm} CFM · {run.input.totalStaticPressure} in w.c.
              </p>
              {run.result && (
                <p className="text-xs text-slate-400">
                  Round {run.result.round.diameter}&quot; • Rect {run.result.rectangular.width}×
                  {run.result.rectangular.height}&quot;
                </p>
              )}
            </div>
          )}
          emptyMessage="No duct sizing runs saved yet."
        />
      </div>
    </div>
  );
}

function LabeledNumber({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  step?: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
      {label}
      <input
        type="number"
        value={value}
        step={step}
        onChange={onChange}
        className="rounded-md border border-sky-500/30 bg-slate-900 px-3 py-2 text-slate-100"
      />
    </label>
  );
}
