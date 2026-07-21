import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MoneyText } from '@/components/money-text';
import { StatusBadge } from '@/components/status-badge';
import { useThemeColor } from '@/hooks/use-theme-color';
import { LeadSummary } from '@/lib/api-types';

function timeAgo(isoDate: string) {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days >= 1) return `${days}d waiting`;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours >= 1) return `${hours}h waiting`;
  return 'just now';
}

export function LeadCard({ lead, onPress }: { lead: LeadSummary; onPress: () => void }) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'textSecondary');
  const tint = useThemeColor({}, 'tint');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: surface, borderColor: border, opacity: pressed ? 0.85 : 1 },
      ]}>
      <View style={styles.headerRow}>
        <Text style={[styles.reference, { color: secondaryColor }]}>{lead.reference_no}</Text>
        <StatusBadge status={lead.status} />
      </View>

      <Text style={[styles.customer, { color: textColor }]} numberOfLines={1}>
        {lead.customer?.legal_name}
      </Text>

      {lead.current_stage && (
        <Text style={[styles.stage, { color: tint }]} numberOfLines={1}>
          {lead.current_stage.label}
        </Text>
      )}

      <View style={styles.footerRow}>
        <MoneyText
          value={lead.final_mrc ?? lead.estimated_mrc}
          currency={lead.currency?.name ?? 'PKR'}
        />
        <Text style={[styles.meta, { color: secondaryColor }]}>{timeAgo(lead.creation_time)}</Text>
      </View>

      <Text style={[styles.kam, { color: secondaryColor }]} numberOfLines={1}>
        KAM: {lead.user?.full_name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reference: {
    fontSize: 12,
    fontWeight: '500',
  },
  customer: {
    fontSize: 17,
    fontWeight: '600',
  },
  stage: {
    fontSize: 13,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  meta: {
    fontSize: 12,
  },
  kam: {
    fontSize: 12,
  },
});
