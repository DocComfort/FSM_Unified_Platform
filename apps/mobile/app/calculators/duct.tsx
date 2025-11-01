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
import { calculateDuctSizing, type DuctSizingResult } from '@fsm/calculators';
import { useCalculatorHistory } from '../../src/hooks/useCalculatorHistory';

interface DuctFormState {
  airflowCfm: number;
  straightLengthFeet: number;
  totalStaticPressure: number;
  desiredWidthInches?: number;
  targetVelocityFpm?: number;
}

const defaultForm: DuctFormState = {
  airflowCfm: 1400,
  straightLengthFeet: 65,
  totalStaticPressure: 0.8,
  desiredWidthInches: 18,
  targetVelocityFpm: 900,
};

export default function DuctCalculatorScreen() {
  const [form, setForm] = useState<DuctFormState>(defaultForm);
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

  const updateValue = (key: keyof DuctFormState, value: string) => {
    const next = Number(value);
    setForm((prev) => ({ ...prev, [key]: Number.isFinite(next) ? next : prev[key] }));
  };

  const handleSave = async () => {
    if (!sizing) return;
    await saveRun({ input: form, result: sizing, notes });
    setNotes('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen
        options={{
          title: 'Duct sizing',
          headerShown: true,
          headerTintColor: '#f8fafc',
          headerStyle: { backgroundColor: '#020617' },
        }}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inputs</Text>
        <View style={styles.grid}>
          <NumberInput label="Airflow (CFM)" value={form.airflowCfm} onChange={(value) => updateValue('airflowCfm', value)} />
          <NumberInput
            label="Straight length (ft)"
            value={form.straightLengthFeet}
            onChange={(value) => updateValue('straightLengthFeet', value)}
          />
          <NumberInput
            label="Total static pressure"
            value={form.totalStaticPressure}
            onChange={(value) => updateValue('totalStaticPressure', value)}
          />
          <NumberInput
            label="Target velocity (FPM)"
            value={form.targetVelocityFpm ?? 0}
            onChange={(value) => updateValue('targetVelocityFpm', value)}
          />
          <NumberInput
            label="Desired width (in)"
            value={form.desiredWidthInches ?? 0}
            onChange={(value) => updateValue('desiredWidthInches', value)}
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
        <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={handleSave} disabled={!sizing}>
          <Text style={styles.buttonText}>Save run</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sizing result</Text>
        <View style={styles.card}>
          {sizing ? (
            <>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Round</Text>
                <Text style={styles.rowValue}>
                  {sizing.round.diameter}" Ø · {sizing.round.velocity.toFixed(0)} FPM · Friction {sizing.round.frictionRate.toFixed(3)} in/100ft
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Rectangular</Text>
                <Text style={styles.rowValue}>
                  {sizing.rectangular.width}" × {sizing.rectangular.height}" · {sizing.rectangular.velocity.toFixed(0)} FPM · AR{' '}
                  {sizing.rectangular.aspectRatio.toFixed(1)}
                </Text>
              </View>
              {sizing.warnings.length > 0 && (
                <View style={styles.warningBox}>
                  {sizing.warnings.map((warning) => (
                    <Text key={warning} style={styles.warningText}>
                      • {warning}
                    </Text>
                  ))}
                </View>
              )}
            </>
          ) : (
            <Text style={styles.emptyText}>Enter valid data to compute duct sizing.</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>History</Text>
        {history.length ? (
          history.map((run) => (
            <View key={run.id} style={styles.historyCard}>
              <Text style={styles.historyTitle}>
                {run.input.airflowCfm} CFM · {run.input.totalStaticPressure} in w.c.
              </Text>
              <Text style={styles.historyMeta}>{new Date(run.createdAt).toLocaleString()}</Text>
              {run.result && (
                <Text style={styles.historyDetail}>
                  Round {run.result.round.diameter}" • Rect {run.result.rectangular.width}×{run.result.rectangular.height}"
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
    borderColor: '#38bdf830',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 16,
  },
  notesInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#38bdf830',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 15,
    minHeight: 90,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#1d4ed8',
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
    gap: 6,
  },
  rowLabel: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  rowValue: {
    color: '#cbd5f5',
    fontSize: 13,
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
    color: '#fbd38d',
    fontSize: 12,
  },
  historySource: {
    color: '#38bdf8',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
