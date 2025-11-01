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
import { predictAirflowStaticPressure, type AirflowPrediction } from '@fsm/calculators';
import { useCalculatorHistory } from '../../src/hooks/useCalculatorHistory';

interface AirflowFormState {
  measuredCfm: number;
  measuredSupplySp: number;
  measuredReturnSp: number;
  minCfm: number;
  maxCfm: number;
  step: number;
}

const defaultForm: AirflowFormState = {
  measuredCfm: 1200,
  measuredSupplySp: 0.32,
  measuredReturnSp: 0.18,
  minCfm: 900,
  maxCfm: 1500,
  step: 100,
};

export default function AirflowCalculatorScreen() {
  const [form, setForm] = useState<AirflowFormState>(defaultForm);
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

  const updateValue = (key: keyof AirflowFormState, value: string) => {
    const next = Number(value);
    setForm((prev) => ({ ...prev, [key]: Number.isFinite(next) ? next : prev[key] }));
  };

  const handleSave = async () => {
    if (!predictions.length) return;
    await saveRun({ input: form, result: predictions, notes });
    setNotes('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Airflow predictor',
          headerShown: true,
          headerTintColor: '#f8fafc',
          headerStyle: { backgroundColor: '#020617' },
        }}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inputs</Text>
        <View style={styles.grid}>
          <NumberInput label="Measured CFM" value={form.measuredCfm} onChange={(value) => updateValue('measuredCfm', value)} />
          <NumberInput
            label="Supply static (in w.c.)"
            value={form.measuredSupplySp}
            onChange={(value) => updateValue('measuredSupplySp', value)}
          />
          <NumberInput
            label="Return static (in w.c.)"
            value={form.measuredReturnSp}
            onChange={(value) => updateValue('measuredReturnSp', value)}
          />
          <NumberInput label="Min CFM" value={form.minCfm} onChange={(value) => updateValue('minCfm', value)} />
          <NumberInput label="Max CFM" value={form.maxCfm} onChange={(value) => updateValue('maxCfm', value)} />
          <NumberInput label="Step" value={form.step} onChange={(value) => updateValue('step', value)} />
        </View>
        <TextInput
          style={styles.notesInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes (optional)"
          placeholderTextColor="#64748b"
          multiline
        />
        <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleSave} disabled={!predictions.length}>
          <Text style={styles.buttonText}>Save run</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Predictions</Text>
        <View style={styles.card}>
          {predictions.slice(0, 6).map((prediction) => (
            <View key={prediction.newCfm} style={styles.row}>
              <Text style={styles.rowLabel}>{prediction.newCfm} CFM</Text>
              <Text style={styles.rowValue}>
                Supply {prediction.predictedSupplySp.toFixed(2)}&quot; • Return {prediction.predictedReturnSp.toFixed(2)}&quot; • Total{' '}
                {prediction.predictedTotalSp.toFixed(2)}&quot;
              </Text>
            </View>
          ))}
          {!predictions.length && (
            <Text style={styles.emptyText}>Enter valid readings to generate predictions.</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>History</Text>
        {history.length ? (
          history.map((run) => (
            <View key={run.id} style={styles.historyCard}>
              <Text style={styles.historyTitle}>
                {run.input.measuredCfm} CFM • Supply {run.input.measuredSupplySp}&quot; • Return {run.input.measuredReturnSp}&quot;
              </Text>
              <Text style={styles.historyMeta}>{new Date(run.createdAt).toLocaleString()}</Text>
              {run.result && run.result.length > 0 && (
                <Text style={styles.historyDetail}>
                  Range {run.result[0].newCfm}-{run.result[run.result.length - 1].newCfm} CFM
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
    borderColor: '#22d3ee30',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 16,
  },
  notesInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#22d3ee30',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 15,
    minHeight: 90,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#0f766e',
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
  row: {
    gap: 4,
  },
  rowLabel: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  rowValue: {
    color: '#cbd5f5',
    fontSize: 13,
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
