import { Stack, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const calculators = [
  { title: 'Airflow predictor', description: 'Project static pressure changes and log fan measurements.', href: '/calculators/airflow' },
  { title: 'Duct sizing', description: 'Size round/rectangular ducts and capture velocity warnings.', href: '/calculators/duct' },
  { title: 'Manual J estimator', description: 'Estimate sensible/latent loads and recommended tonnage.', href: '/calculators/manual-j' },
  { title: 'Filter performance', description: 'Check face velocity and delta-P for filter selections.', href: '/calculators/filter' },
];

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" />
      <Stack.Screen options={{ title: 'Technician Hub', headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.kicker}>FSM Unified Platform</Text>
        <Text style={styles.title}>Calculators & diagnostics</Text>
        <Text style={styles.subtitle}>
          Launch calculators, review saved runs, and sync with Supabase history once you sign in. Saved sessions
          stay on-device when offline.
        </Text>
      </View>

      <View style={styles.grid}>
        {calculators.map((item) => (
          <Link href={item.href} key={item.href} asChild>
            <TouchableOpacity activeOpacity={0.85} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </TouchableOpacity>
          </Link>
        ))}
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
    gap: 20,
  },
  header: {
    gap: 12,
  },
  kicker: {
    color: '#34d399',
    fontSize: 13,
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
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 20,
    gap: 8,
  },
  cardTitle: {
    color: '#f1f5f9',
    fontSize: 18,
    fontWeight: '600',
  },
  cardDescription: {
    color: '#cbd5f5',
    fontSize: 14,
    lineHeight: 20,
  },
});
