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
import {
  calculateBasicFilterParameters,
  type BasicFilterInput,
  type BasicFilterResult,
} from '@fsm/calculators';
import { useCalculatorHistory } from '../../src/hooks/useCalculatorHistory';

const climateOptions: BasicFilterInput['climateZone'][] = ['hot-humid', 'moist', 'dry', 'marine'];
const filterTypeOptions: BasicFilterInput['filterType'][] = [
  'fiberglass',
  'pleated-basic',
  'pleated-better',
  'pleated-best',
];

const defaultForm: BasicFilterInput = {
  systemSizeTons: 3.5,
  climateZone: 'moist',
  filterType: 'pleated-better',
  widthInches: 20,
  heightInches: 25,
};

export default function FilterCalculatorScreen() {
  const [form, setForm] = useState<BasicFilterInput>(defaultForm);
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

  const updateValue = (key: keyof BasicFilterInput, value: string) => {
    const next = Number(value);
    setForm((prev) => ({ ...prev, [key]: Number.isFinite(next) ? next : prev[key] }));
  };

  const handleSave = async () => {
    await saveRun({ input: form, result, notes });
    setNotes('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Filter performance',
          headerShown: true,
          headerTintColor: '#f8fafc',
          headerStyle: { backgroundColor: '#020617' },
        }}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inputs</Text>
        <View style={styles.grid}>
          <NumberInput
            label="System size (tons)"
            value={form.systemSizeTons}
            onChange={(value) => updateValue('systemSizeTons', value)}
          />
          <OptionChips
            label="Climate zone"
            options={climateOptions}
            value={form.climateZone}
            onChange={(value) => setForm((prev) => ({ ...prev, climateZone: value }))}
          />
          <OptionChips
            label="Filter type"
            options={filterTypeOptions}
            value={form.filterType}
            onChange={(value) => setForm((prev) => ({ ...prev, filterType: value }))}
          />
          <NumberInput
            label="Width (in)"
            value={form.widthInches}
            onChange={(value) => updateValue('widthInches', value)}
          />
          <NumberInput
            label="Height (in)"
            value={form.heightInches}
            onChange={(value) => updateValue('heightInches', value)}
          />
        </View>

        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes (optional)"
          placeholderTextColor="#64748b"
          multiline
        />
        <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleSave}>
          <Text style={styles.buttonText}>Save run</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Performance summary</Text>
        <View style={styles.card}>
          <Metric label="Total airflow" value={`${result.totalCfm.toFixed(0)} CFM`} />
          <Metric label="Filter area" value={`${result.filterArea.toFixed(2)} sq ft`} />
          <Metric label="Face velocity" value={`${result.faceVelocity.toFixed(0)} FPM`} />
          <Metric label="Initial ΔP" value={`${result.initialPressureDrop.toFixed(3)} in w.c.`} />
          <Metric label="Max ΔP" value={`${result.maxPressureDrop.toFixed(2)} in w.c.`} />
          {result.warnings.length > 0 && (
            <View style={styles.warningBox}>
              {result.warnings.map((warning) => (
                <Text key={warning} style={styles.warningText}>
                  • {warning}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>History</Text>
        {history.length ? (
          history.map((run) => (
            <View key={run.id} style={styles.historyCard}>
              <Text style={styles.historyTitle}>
                {run.input.systemSizeTons} tons · {run.input.filterType} · {run.input.widthInches}"×{run.input.heightInches}"
              </Text>
              <Text style={styles.historyMeta}>{new Date(run.createdAt).toLocaleString()}</Text>
              <Text style={styles.historyDetail}>
                Face {run.result?.faceVelocity.toFixed(0)} FPM · ΔP {run.result?.initialPressureDrop.toFixed(3)} in w.c.
              </Text>
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
    borderColor: '#f43f5e40',
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
    borderColor: '#f43f5e40',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#0f172a',
  },
  chipActive: {
    backgroundColor: '#be123c33',
    borderColor: '#f43f5e',
  },
  chipText: {
    color: '#e2e8f0',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: '#f772a1',
    fontWeight: '600',
  },
  notesInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f43f5e40',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 15,
    minHeight: 90,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#be123c',
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
    color: '#fda4af',
    fontSize: 12,
  },
  historySource: {
    color: '#38bdf8',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
