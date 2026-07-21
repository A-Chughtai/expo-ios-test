import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getLeads } from '@/lib/api/leads';
import { ApiError } from '@/lib/api-client';
import { LeadSummary } from '@/lib/api-types';

// POC note (brief §5.6): real push notifications need APNs/FCM + Expo push tokens, which are
// out of scope here. This screen simulates "a deal entered my queue" using the same data the
// queue reads, deep-linking by reference no the same way a real push notification would.
export default function NotificationsScreen() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const background = useThemeColor({}, 'background');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'textSecondary');
  const tint = useThemeColor({}, 'tint');
  const danger = useThemeColor({}, 'danger');

  const load = useCallback(async () => {
    try {
      setError(null);
      const result = await getLeads();
      setLeads(result.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load notifications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={tint} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <View style={styles.header}>
        <ThemedText type="title">Notifications</ThemedText>
        <Text style={{ color: secondaryColor, marginTop: 4 }}>
          In-app only in this POC — no push notifications are wired up yet.
        </Text>
      </View>

      {error && <Text style={{ color: danger, paddingHorizontal: 20 }}>{error}</Text>}

      <FlatList
        data={leads}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.row, { backgroundColor: surface, borderColor: border }]}
            onPress={() => router.push(`/approval/${item.reference_no}?leadId=${item.id}`)}>
            <View style={[styles.dot, { backgroundColor: tint }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: textColor }]}>
                {item.customer?.legal_name} needs your approval
              </Text>
              <Text style={[styles.rowSubtitle, { color: secondaryColor }]}>
                {item.current_stage?.label ?? 'Pending stage'} · {item.reference_no}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          !error ? (
            <Text style={[styles.empty, { color: secondaryColor }]}>No notifications yet.</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  listContent: { paddingHorizontal: 20, paddingBottom: 32 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    marginVertical: 6,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  rowTitle: { fontSize: 15, fontWeight: '600' },
  rowSubtitle: { fontSize: 13, marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 60 },
});
