import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getDashboardCount } from '@/lib/api/dashboard';
import { ApiError } from '@/lib/api-client';
import { DashboardCount } from '@/lib/api-types';

function KpiCard({ label, value }: { label: string; value: number }) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'textSecondary');

  return (
    <View style={[kpiStyles.card, { backgroundColor: surface, borderColor: border }]}>
      <Text style={[kpiStyles.value, { color: textColor }]}>{value}</Text>
      <Text style={[kpiStyles.label, { color: secondaryColor }]}>{label}</Text>
    </View>
  );
}

const kpiStyles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: '45%',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 4,
  },
  value: { fontSize: 26, fontWeight: '700' },
  label: { fontSize: 13 },
});

export default function DashboardScreen() {
  const [counts, setCounts] = useState<DashboardCount | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const background = useThemeColor({}, 'background');
  const tint = useThemeColor({}, 'tint');
  const danger = useThemeColor({}, 'danger');
  const secondaryColor = useThemeColor({}, 'textSecondary');

  useEffect(() => {
    getDashboardCount()
      .then(setCounts)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load dashboard.'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={tint} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Dashboard</ThemedText>
        <Text style={{ color: secondaryColor, marginTop: 4, marginBottom: 20 }}>
          A quick glance — not a replacement for the full CRM dashboard.
        </Text>

        {error && <Text style={{ color: danger, marginBottom: 12 }}>{error}</Text>}

        {counts && (
          <View style={[styles.hero, { borderColor: tint }]}>
            <Text style={[styles.heroValue, { color: tint }]}>{counts.pending_lead}</Text>
            <Text style={{ color: secondaryColor }}>deals pending approval</Text>
          </View>
        )}

        {counts && (
          <View style={styles.grid}>
            <KpiCard label="Total leads" value={counts.total_lead} />
            <KpiCard label="Won" value={counts.win_lead} />
            <KpiCard label="Killed" value={counts.kill_lead} />
            <KpiCard label="Customers" value={counts.customer} />
            <KpiCard label="Circuits" value={counts.circuit} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  hero: {
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 20,
    gap: 4,
  },
  heroValue: { fontSize: 40, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
});
