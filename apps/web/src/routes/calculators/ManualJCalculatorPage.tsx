import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { StatusCard } from '@fsm/ui-web';
import { calculateManualJ, type ManualJInput, type ManualJResult } from '@fsm/calculators';
import { HistoryTimeline } from '../../components/HistoryTimeline';
import { useCalculatorHistory } from '../../hooks/useCalculatorHistory';

const insulationOptions: ManualJInput['insulation'][] = ['poor', 'average', 'good', 'excellent'];
const windowOptions: ManualJInput['windowEfficiency'][] = ['single-pane', 'double-pane', 'low-e'];
const infiltrationOptions: ManualJInput['infiltration'][] = ['loose', 'average', 'tight'];
const climateOptions: ManualJInput['climate'][] = ['very-cold', 'cold', 'mixed', 'hot-humid', 'hot-dry'];
const shadingOptions: ManualJInput['shading'][] = ['none', 'partial', 'full'];

const defaultManualJState: ManualJInput = {
  squareFootage: 2200,
  ceilingHeight: 8,
  insulation: 'average',
  windowEfficiency: 'double-pane',
  infiltration: 'average',
  climate: 'mixed',
  shading: 'partial',
  occupants: 4,
  ventilationCfm: 60,
  runtimeFactor: 0.85,
};

export default function ManualJCalculatorPage() {
  const [form, setForm] = useState<ManualJInput>(defaultManualJState);
  const [notes, setNotes] = useState('');
  const hydrated = useRef(false);

  const { history, saveRun } = useCalculatorHistory<ManualJInput, ManualJResult | null>('manual_j');

  useEffect(() => {
    if (hydrated.current) return;
    if (history.length && history[0]?.input) {
      setForm(history[0].input);
      hydrated.current = true;
    }
  }, [history]);

  const result = useMemo(() => calculateManualJ(form), [form]);

  const handleNumberChange =
    (key: keyof ManualJInput) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      setForm((prev) => ({ ...prev, [key]: Number.isFinite(value) ? value : prev[key] }));
    };

  const handleSaveRun = async () => {
    if (!result) return;
    await saveRun({ input: form, result, notes });
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-100">Manual J estimator</h2>
        <p className="text-sm text-slate-400">
          Estimate sensible/latent loads, recommended tonnage, and airflow based on Manual J inputs.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <StatusCard tone="warning" title="Envelope & ventilation">
          <div className="grid grid-cols-2 gap-3 text-slate-100">
            <LabeledNumber
              label="Square footage"
              value={form.squareFootage}
              onChange={handleNumberChange('squareFootage')}
            />
            <LabeledNumber
              label="Ceiling height"
              step={0.5}
              value={form.ceilingHeight}
              onChange={handleNumberChange('ceilingHeight')}
            />
            <LabeledNumber label="Occupants" value={form.occupants} onChange={handleNumberChange('occupants')} />
            <LabeledNumber
              label="Ventilation CFM"
              value={form.ventilationCfm ?? 0}
              onChange={handleNumberChange('ventilationCfm')}
            />
            <LabeledNumber
              label="Runtime factor"
              step={0.05}
              value={form.runtimeFactor ?? 0}
              onChange={handleNumberChange('runtimeFactor')}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-slate-100">
            <SelectField
              label="Insulation"
              value={form.insulation}
              options={insulationOptions}
              onChange={(value) => setForm((prev) => ({ ...prev, insulation: value }))}
            />
            <SelectField
              label="Windows"
              value={form.windowEfficiency}
              options={windowOptions}
              onChange={(value) => setForm((prev) => ({ ...prev, windowEfficiency: value }))}
            />
            <SelectField
              label="Infiltration"
              value={form.infiltration}
              options={infiltrationOptions}
              onChange={(value) => setForm((prev) => ({ ...prev, infiltration: value }))}
            />
            <SelectField
              label="Climate"
              value={form.climate}
              options={climateOptions}
              onChange={(value) => setForm((prev) => ({ ...prev, climate: value }))}
            />
            <SelectField
              label="Shading"
              value={form.shading}
              options={shadingOptions}
              onChange={(value) => setForm((prev) => ({ ...prev, shading: value }))}
            />
          </div>

          <div className="mt-4 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-300">
              Notes
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="mt-1 h-20 w-full rounded-lg border border-amber-500/30 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                placeholder="Optional context for this run..."
              />
            </label>
            <button
              type="button"
              onClick={handleSaveRun}
              disabled={!result}
              className="inline-flex items-center justify-center rounded-lg border border-amber-500/60 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save run
            </button>
          </div>
        </StatusCard>

        <StatusCard tone="success" title="Load summary">
          {result ? (
            <div className="space-y-3 text-sm text-slate-200">
              <div className="grid grid-cols-2 gap-3">
                <Metric label="Cooling load" value={`${result.coolingLoadBtuh.toLocaleString()} BTU/h`} />
                <Metric label="Heating load" value={`${result.heatingLoadBtuh.toLocaleString()} BTU/h`} />
                <Metric label="Sensible" value={`${result.sensibleCoolingBtuh.toLocaleString()} BTU/h`} />
                <Metric label="Latent" value={`${result.latentCoolingBtuh.toLocaleString()} BTU/h`} />
                <Metric label="SHR" value={result.sensibleHeatRatio.toFixed(2)} />
                <Metric label="Recommended tonnage" value={`${result.recommendedTonnage.toFixed(1)} tons`} />
                <Metric label="Supply airflow" value={`${result.recommendedAirflowCfm} CFM`} />
                <Metric label="Infiltration" value={`${result.infiltrationCfm} CFM`} />
              </div>
              {result.warnings.length > 0 && (
                <ul className="list-disc space-y-1 rounded-lg border border-rose-500/30 bg-slate-950/60 px-4 py-3 text-xs text-rose-200">
                  {result.warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400">Enter valid envelope inputs to generate Manual J estimates.</p>
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
                {run.input.squareFootage} sqft · {run.input.climate} · {run.input.insulation}
              </p>
              {run.result && (
                <p className="text-xs text-slate-400">
                  Cooling {run.result.coolingLoadBtuh.toLocaleString()} | Heating {run.result.heatingLoadBtuh.toLocaleString()}
                </p>
              )}
            </div>
          )}
          emptyMessage="No Manual J runs saved yet."
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
        className="rounded-md border border-amber-500/30 bg-slate-900 px-3 py-2 text-slate-100"
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
        className="rounded-md border border-amber-500/30 bg-slate-900 px-3 py-2 text-slate-100"
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
