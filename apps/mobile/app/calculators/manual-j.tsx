import { useEffect, useMemo, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { calculateManualJ, type ManualJInput, type ManualJResult } from '@fsm/calculators';
import { useCalculatorHistory } from '../../src/hooks/useCalculatorHistory';

const insulationOptions: ManualJInput['insulation'][] = ['poor', 'average', 'good', 'excellent'];
const windowOptions: ManualJInput['windowEfficiency'][] = ['single-pane', 'double-pane', 'low-e'];
const infiltrationOptions: ManualJInput['infiltration'][] = ['loose', 'average', 'tight'];
const climateOptions: ManualJInput['climate'][] = ['very-cold', 'cold', 'mixed', 'hot-humid', 'hot-dry'];
const shadingOptions: ManualJInput['shading'][] = ['none', 'partial', 'full'];

const defaultForm: ManualJInput = {
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

export default function ManualJCalculatorScreen() {
  const [form, setForm] = useState<ManualJInput>(defaultForm);
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

  const updateValue = (key: keyof ManualJInput, value: string) => {
    const next = Number(value);
    setForm((prev) => ({ ...prev, [key]: Number.isFinite(next) ? next : prev[key] }));
  };

  const handleSave = async () => {
    if (!result) return;
    await saveRun({ input: form, result, notes });
    setNotes('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Manual J estimator',
          headerShown: true,
          headerTintColor: '#f8fafc',
          headerStyle: { backgroundColor: '#020617' },
        }}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Envelope</Text>
        <View style={styles.grid}>
          <NumberInput
            label="Square footage"
            value={form.squareFootage}
            onChange={(value) => updateValue('squareFootage', value)}
          />
          <NumberInput
            label="Ceiling height"
            value={form.ceilingHeight}
            onChange={(value) => updateValue('ceilingHeight', value)}
          />
          <NumberInput label="Occupants" value={form.occupants} onChange={(value) => updateValue('occupants', value)} />
          <NumberInput
            label="Ventilation CFM"
            value={form.ventilationCfm ?? 0}
            onChange={(value) => updateValue('ventilationCfm', value)}
          />
          <NumberInput
            label="Runtime factor"
            value={form.runtimeFactor ?? 0}
            onChange={(value) => updateValue('runtimeFactor', value)}
          />
        </View>

        <OptionChips
          label="Insulation"
          options={insulationOptions}
          value={form.insulation}
          onChange={(value) => setForm((prev) => ({ ...prev, insulation: value }))}
        />
        <OptionChips
          label="Windows"
          options={windowOptions}
          value={form.windowEfficiency}
          onChange={(value) => setForm((prev) => ({ ...prev, windowEfficiency: value }))}
        />
        <OptionChips
          label="Infiltration"
          options={infiltrationOptions}
          value={form.infiltration}
          onChange={(value) => setForm((prev) => ({ ...prev, infiltration: value }))}
        />
        <OptionChips
          label="Climate"
          options={climateOptions}
          value={form.climate}
          onChange={(value) => setForm((prev) => ({ ...prev, climate: value }))}
        />
        <OptionChips
          label="Shading"
          options={shadingOptions}
          value={form.shading}
          onChange={(value) => setForm((prev) => ({ ...prev, shading: value }))}
        />

        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes (optional)"
          placeholderTextColor="#64748b"
          multiline
        />
        <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleSave} disabled={!result}>
          <Text style={styles.buttonText}>Save run</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Load summary</Text>
        <View style={styles.card}>
          {result ? (
            <>
              <Metric label="Cooling load" value={`${result.coolingLoadBtuh.toLocaleString()} BTU/h`} />
              <Metric label="Heating load" value={`${result.heatingLoadBtuh.toLocaleString()} BTU/h`} />
              <Metric label="Sensible" value={`${result.sensibleCoolingBtuh.toLocaleString()} BTU/h`} />
              <Metric label="Latent" value={`${result.latentCoolingBtuh.toLocaleString()} BTU/h`} />
              <Metric label="SHR" value={result.sensibleHeatRatio.toFixed(2)} />
              <Metric label="Tonnage" value={`${result.recommendedTonnage.toFixed(1)} tons`} />
              <Metric label="Supply airflow" value={`${result.recommendedAirflowCfm} CFM`} />
              <Metric label="Infiltration" value={`${result.infiltrationCfm} CFM`} />
              {result.warnings.length > 0 && (
                <View style={styles.warningBox}>
                  {result.warnings.map((warning) => (
                    <Text key={warning} style={styles.warningText}>
                      • {warning}
                    </Text>
                  ))}
                </View>
              )}
            </>
          ) : (
            <Text style={styles.emptyText}>Enter valid data to compute Manual J loads.</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>History</Text>
        {history.length ? (
          history.map((run) => (
            <View key={run.id} style={styles.historyCard}>
              <Text style={styles.historyTitle}>
                {run.input.squareFootage} sqft · {run.input.climate} · {run.input.insulation}
              </Text>
              <Text style={styles.historyMeta}>{new Date(run.createdAt).toLocaleString()}</Text>
              {run.result && (
                <Text style={styles.historyDetail}>
                  Cooling {run.result.coolingLoadBtuh.toLocaleString()} • Heating {run.result.heatingLoadBtuh.toLocaleString()}
                </Text>
              )}
              {run.notes && <Text style={styles.historyNotes}>Notes: {run.notes}</Text>}
              <Text style={styles.historySource}>{run.source === 'remote' ? 'Synced to Supabase' : 'Local run'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No runs saved yet.</Text>
        )}
      </View>
    </ScrollView>
  );
}

function NumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={String(value)}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        placeholderTextColor="#64748b"
      />
    </View>
  );
}

function OptionChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.optionGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.optionRow}>
        {options.map((option) => {
          const active = option === value;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onChange(option)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#020617',
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  inputGroup: {
    width: '48%',
    gap: 6,
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fbbf2430',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 16,
  },
  optionGroup: {
    gap: 6,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#fbbf2440',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#0f172a',
  },
  chipActive: {
    backgroundColor: '#f59e0b33',
    borderColor: '#f59e0b',
  },
  chipText: {
    color: '#e2e8f0',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: '#fbbf24',
    fontWeight: '600',
  },
  notesInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fbbf2430',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 15,
    minHeight: 90,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#b45309',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#f8fafc',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#0f172a',
    padding: 16,
    gap: 12,
  },
  metric: {
    gap: 4,
  },
  metricLabel: {
    color: '#94a3b8',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '600',
  },
  warningBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f97316',
    backgroundColor: '#7c2d12',
    padding: 12,
    gap: 4,
  },
  warningText: {
    color: '#fff7ed',
    fontSize: 12,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
  },
  historyCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#0f172a',
    padding: 16,
    gap: 6,
    marginBottom: 12,
  },
  historyTitle: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  historyMeta: {
    color: '#94a3b8',
    fontSize: 12,
  },
  historyDetail: {
    color: '#cbd5f5',
    fontSize: 13,
  },
  historyNotes: {
    color: '#fde68a',
    fontSize: 12,
  },
  historySource: {
    color: '#38bdf8',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
