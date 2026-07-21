import { StyleSheet, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type StatusKind = 'pending' | 'success' | 'danger' | 'info' | 'neutral';

const LABELS: Record<string, { kind: StatusKind; label: string }> = {
  PENDING: { kind: 'pending', label: 'Pending' },
  WIN: { kind: 'success', label: 'Won' },
  REJECTED: { kind: 'danger', label: 'Rejected' },
  KILLED: { kind: 'danger', label: 'Killed' },
  ACTIVE: { kind: 'info', label: 'Active' },
  PROCESSED: { kind: 'success', label: 'Done' },
};

export function StatusBadge({ status }: { status: string }) {
  const mapped = LABELS[status.toUpperCase()] ?? { kind: 'neutral' as const, label: status };
  return <StatusBadgeRaw kind={mapped.kind} label={mapped.label} />;
}

export function StatusBadgeRaw({ kind, label }: { kind: StatusKind; label: string }) {
  const bg = useThemeColor({}, kind === 'neutral' ? 'border' : kind);
  const textColor = useThemeColor({}, 'surface');

  return (
    <View style={[styles.badge, { backgroundColor: kind === 'neutral' ? bg : bg }]}>
      <Text style={[styles.text, { color: kind === 'neutral' ? undefined : textColor }]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
