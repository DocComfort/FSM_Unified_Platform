import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const [status] = useState('Mobile scaffold ready for unified FSM experience.');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.kicker}>FSM Unified Platform</Text>
        <Text style={styles.title}>Technician app scaffold online.</Text>
        <Text style={styles.subtitle}>
          Replace this placeholder with authentication, offline sync flows, and job dashboards as we
          merge modules from the legacy mobile repositories.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status</Text>
          <Text style={styles.cardText}>{status}</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <Text style={styles.gridTitle}>Immediate Tasks</Text>
            <Text style={styles.gridText}>- Connect Supabase auth session bridge.</Text>
            <Text style={styles.gridText}>- Bring in offline storage + sync engine.</Text>
            <Text style={styles.gridText}>- Implement navigation shell and theming.</Text>
          </View>
          <View style={styles.gridCard}>
            <Text style={styles.gridTitle}>Shared Modules</Text>
            <Text style={styles.gridText}>- Diagnostics & calculators (from BOLT).</Text>
            <Text style={styles.gridText}>- Inventory & scheduling (HVAC Pro core).</Text>
            <Text style={styles.gridText}>- Twilio communications (Docs-Fantastic).</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#020617',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  content: {
    gap: 24,
  },
  kicker: {
    color: '#34d399',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#f8fafc',
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: '#cbd5f5',
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 20,
  },
  cardTitle: {
    color: '#86efac',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    color: '#e2e8f0',
    fontSize: 16,
  },
  grid: {
    gap: 16,
  },
  gridCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 18,
  },
  gridTitle: {
    color: '#bae6fd',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  gridText: {
    color: '#d1d5db',
    fontSize: 15,
    marginBottom: 4,
  },
});
