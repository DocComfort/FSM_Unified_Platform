import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { StatusCard } from '@fsm/ui-web';
import { predictAirflowStaticPressure, type AirflowPrediction } from '@fsm/calculators';
import { HistoryTimeline } from '../../components/HistoryTimeline';
import { useCalculatorHistory, type CalculatorRun } from '../../hooks/useCalculatorHistory';

interface AirflowFormState {
  measuredCfm: number;
  measuredSupplySp: number;
  measuredReturnSp: number;
  minCfm: number;
  maxCfm: number;
  step: number;
}

const defaultAirflowState: AirflowFormState = {
  measuredCfm: 1200,
  measuredSupplySp: 0.32,
  measuredReturnSp: 0.18,
  minCfm: 900,
  maxCfm: 1500,
  step: 100,
};

export default function AirflowCalculatorPage() {
  const [form, setForm] = useState<AirflowFormState>(defaultAirflowState);
  const [notes, setNotes] = useState('');
  const hydrated = useRef(false);

  const { history, saveRun } = useCalculatorHistory<AirflowFormState, AirflowPrediction[]>('airflow');

  useEffect(() => {
    if (hydrated.current) return;
    if (history.length && history[0]?.input) {
      setForm(history[0].input);
      hydrated.current = true;
    }
  }, [history]);

  const predictions = useMemo(
    () =>
      predictAirflowStaticPressure(
        form.measuredCfm,
        form.measuredSupplySp,
        form.measuredReturnSp,
        { minCfm: form.minCfm, maxCfm: form.maxCfm, step: form.step }
      ),
    [form]
  );

  const handleChange =
    (key: keyof AirflowFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setForm((prev) => ({ ...prev, [key]: Number.isFinite(value) ? value : prev[key] }));
    };

  const handleSaveRun = async () => {
    if (!predictions.length) return;
    await saveRun({ input: form, result: predictions, notes });
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-100">Airflow predictor</h2>
        <p className="text-sm text-slate-400">
          Project static pressure changes using fan affinity laws. Save the run to reuse the parameters later or
          sync them with Supabase history.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <StatusCard tone="success" title="Input parameters">
          <div className="grid grid-cols-2 gap-3 text-slate-100">
            <LabeledNumber
              label="Measured CFM"
              value={form.measuredCfm}
              onChange={handleChange('measuredCfm')}
            />
            <LabeledNumber
              label="Supply static (in w.c.)"
              step={0.01}
              value={form.measuredSupplySp}
              onChange={handleChange('measuredSupplySp')}
            />
            <LabeledNumber
              label="Return static (in w.c.)"
              step={0.01}
              value={form.measuredReturnSp}
              onChange={handleChange('measuredReturnSp')}
            />
            <LabeledNumber label="Min CFM" value={form.minCfm} onChange={handleChange('minCfm')} />
            <LabeledNumber label="Max CFM" value={form.maxCfm} onChange={handleChange('maxCfm')} />
            <LabeledNumber label="Step" value={form.step} onChange={handleChange('step')} />
          </div>

          <div className="mt-4 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-300">
              Notes
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="mt-1 h-20 w-full rounded-lg border border-emerald-500/30 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                placeholder="Optional context for this run..."
              />
            </label>
            <button
              type="button"
              onClick={handleSaveRun}
              disabled={!predictions.length}
              className="inline-flex items-center justify-center rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save run
            </button>
          </div>
        </StatusCard>

        <StatusCard tone="info" title="Predicted static pressure">
          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-sm text-slate-200">
            {predictions.slice(0, 6).map((prediction) => (
              <div
                key={prediction.newCfm}
                className="flex items-center justify-between rounded-lg border border-slate-800/80 px-3 py-2"
              >
                <span className="font-semibold">{prediction.newCfm} CFM</span>
                <span className="text-slate-300">
                  Supply {prediction.predictedSupplySp.toFixed(2)} | Return {prediction.predictedReturnSp.toFixed(2)} | Total{' '}
                  {prediction.predictedTotalSp.toFixed(2)}
                </span>
              </div>
            ))}
            {!predictions.length && (
              <p className="text-slate-400">Enter valid readings to generate airflow predictions.</p>
            )}
          </div>
        </StatusCard>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-200">History</h3>
        <p className="text-xs text-slate-500">
          Recent runs sync to Supabase when authenticated. Local runs stay on this device until you sign in.
        </p>
        <HistoryTimeline
          runs={history}
          formatter={(run: CalculatorRun<AirflowFormState, AirflowPrediction[]>) => (
            <div>
              <p className="font-semibold text-slate-100">
                {run.input.measuredCfm} CFM • Supply {run.input.measuredSupplySp}&rdquo; • Return {run.input.measuredReturnSp}&rdquo;
              </p>
              {run.result && run.result.length > 0 && (() => {
                const first = run.result?.[0];
                const last = run.result?.[run.result.length - 1];
                if (!first || !last) return null;
                return (
                  <p className="text-xs text-slate-400">
                    {first.newCfm}→{first.predictedTotalSp.toFixed(2)}&rdquo; · {last.newCfm}→
                    {last.predictedTotalSp.toFixed(2)}&rdquo;
                  </p>
                );
              })()}
            </div>
          )}
          emptyMessage="No airflow runs have been saved yet."
        />
      </div>
    </div>
  );
}

interface LabeledNumberProps {
  label: string;
  value: number;
  step?: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function LabeledNumber({ label, value, onChange, step }: LabeledNumberProps) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
      {label}
      <input
        type="number"
        value={value}
        step={step}
        onChange={onChange}
        className="rounded-md border border-emerald-500/30 bg-slate-900 px-3 py-2 text-slate-100"
      />
    </label>
  );
}
