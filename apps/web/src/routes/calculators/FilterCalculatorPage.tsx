import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { StatusCard } from '@fsm/ui-web';
import { calculateBasicFilterParameters, type BasicFilterInput, type BasicFilterResult } from '@fsm/calculators';
import { HistoryTimeline } from '../../components/HistoryTimeline';
import { useCalculatorHistory } from '../../hooks/useCalculatorHistory';

const climateOptions: BasicFilterInput['climateZone'][] = ['hot-humid', 'moist', 'dry', 'marine'];
const filterTypeOptions: BasicFilterInput['filterType'][] = [
  'fiberglass',
  'pleated-basic',
  'pleated-better',
  'pleated-best',
];

const defaultFilterState: BasicFilterInput = {
  systemSizeTons: 3.5,
  climateZone: 'moist',
  filterType: 'pleated-better',
  widthInches: 20,
  heightInches: 25,
};

export default function FilterCalculatorPage() {
  const [form, setForm] = useState<BasicFilterInput>(defaultFilterState);
  const [notes, setNotes] = useState('');
  const hydrated = useRef(false);

  const { history, saveRun } = useCalculatorHistory<BasicFilterInput, BasicFilterResult>('filter');

  useEffect(() => {
    if (hydrated.current) return;
    if (history.length && history[0]?.input) {
      setForm(history[0].input);
      hydrated.current = true;
    }
  }, [history]);

  const result = useMemo(() => calculateBasicFilterParameters(form), [form]);

  const handleNumberChange =
    (key: keyof BasicFilterInput) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setForm((prev) => ({ ...prev, [key]: Number.isFinite(value) ? value : prev[key] }));
    };

  const handleSaveRun = async () => {
    await saveRun({ input: form, result, notes });
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-100">Filter performance</h2>
        <p className="text-sm text-slate-400">
          Calculate airflow, face velocity, and estimated pressure drop to validate filter selection.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <StatusCard tone="danger" title="Input parameters">
          <div className="grid grid-cols-2 gap-3 text-slate-100">
            <LabeledNumber
              label="System size (tons)"
              step={0.5}
              value={form.systemSizeTons}
              onChange={handleNumberChange('systemSizeTons')}
            />
            <SelectField
              label="Climate zone"
              value={form.climateZone}
              options={climateOptions}
              onChange={(value) => setForm((prev) => ({ ...prev, climateZone: value }))}
            />
            <SelectField
              label="Filter type"
              value={form.filterType}
              options={filterTypeOptions}
              onChange={(value) => setForm((prev) => ({ ...prev, filterType: value }))}
            />
            <LabeledNumber
              label="Width (in)"
              value={form.widthInches}
              onChange={handleNumberChange('widthInches')}
            />
            <LabeledNumber
              label="Height (in)"
              value={form.heightInches}
              onChange={handleNumberChange('heightInches')}
            />
          </div>

          <div className="mt-4 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-300">
              Notes
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="mt-1 h-20 w-full rounded-lg border border-rose-500/30 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                placeholder="Optional context for this run..."
              />
            </label>
            <button
              type="button"
              onClick={handleSaveRun}
              className="inline-flex items-center justify-center rounded-lg border border-rose-500/60 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
            >
              Save run
            </button>
          </div>
        </StatusCard>

        <StatusCard tone="success" title="Performance summary">
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200">
            <Metric label="Total airflow" value={`${result.totalCfm.toFixed(0)} CFM`} />
            <Metric label="Filter area" value={`${result.filterArea.toFixed(2)} sq ft`} />
            <Metric label="Face velocity" value={`${result.faceVelocity.toFixed(0)} FPM`} />
            <Metric label="Initial ΔP" value={`${result.initialPressureDrop.toFixed(3)} in w.c.`} />
            <Metric label="Max ΔP" value={`${result.maxPressureDrop.toFixed(2)} in w.c.`} />
            {result.warnings.length > 0 && (
              <ul className="list-disc space-y-1 rounded-lg border border-rose-500/30 bg-slate-950/60 px-4 py-3 text-xs text-rose-200">
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            )}
          </div>
        </StatusCard>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-200">History</h3>
        <HistoryTimeline
          runs={history}
          formatter={(run) => (
            <div>
              <p className="font-semibold text-slate-100">
                {run.input.systemSizeTons} tons • {run.input.filterType} • {run.input.widthInches}"×{run.input.heightInches}"
              </p>
              <p className="text-xs text-slate-400">
                Face {run.result?.faceVelocity.toFixed(0)} FPM • ΔP {run.result?.initialPressureDrop.toFixed(3)} in w.c.
              </p>
            </div>
          )}
          emptyMessage="No filter runs saved yet."
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
        className="rounded-md border border-rose-500/30 bg-slate-900 px-3 py-2 text-slate-100"
      />
    </label>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="rounded-md border border-rose-500/30 bg-slate-900 px-3 py-2 text-slate-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}
