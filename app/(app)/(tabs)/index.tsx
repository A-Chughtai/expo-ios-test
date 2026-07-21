import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LeadCard } from '@/components/lead-card';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getLeads } from '@/lib/api/leads';
import { ApiError } from '@/lib/api-client';
import { LeadSummary } from '@/lib/api-types';

export default function ApprovalQueueScreen() {
  const router = useRouter();
  const [leads, setLeads] = useState<LeadSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const background = useThemeColor({}, 'background');
  const secondaryColor = useThemeColor({}, 'textSecondary');
  const tint = useThemeColor({}, 'tint');
  const danger = useThemeColor({}, 'danger');

  const load = useCallback(async () => {
    try {
      setError(null);
      const result = await getLeads();
      setLeads(result.data);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not load your approval queue.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
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
      <View style={styles.headerRow}>
        <ThemedText type="title">Approval queue</ThemedText>
        {leads.length > 0 && (
          <View style={[styles.countBadge, { backgroundColor: tint }]}>
            <Text style={styles.countBadgeText}>{leads.length}</Text>
          </View>
        )}
      </View>

      {error && <Text style={[styles.error, { color: danger }]}>{error}</Text>}

      <FlatList
        data={leads}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <LeadCard
            lead={item}
            onPress={() => router.push(`/approval/${item.reference_no}?leadId=${item.id}`)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          !error ? (
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: secondaryColor }]}>
                You&apos;re all caught up
              </Text>
              <Text style={[styles.emptySubtitle, { color: secondaryColor }]}>
                No deals are waiting on your approval right now.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  countBadge: {
    borderRadius: 999,
    minWidth: 26,
    height: 26,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  error: { paddingHorizontal: 20, paddingBottom: 8 },
  listContent: { paddingHorizontal: 20, paddingBottom: 32, flexGrow: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 6 },
  emptyTitle: { fontSize: 17, fontWeight: '600' },
  emptySubtitle: { fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
});
