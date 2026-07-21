import { StyleSheet, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { ApprovalChainStep } from '@/lib/approval-chain';

// The trust anchor of the decision screen (brief §5.3.2): shows where this deal is, who has
// signed, who is left, and where the current user fits — never a fixed hardcoded sequence.
export function ApprovalChain({ steps }: { steps: ApprovalChainStep[] }) {
  const doneColor = useThemeColor({}, 'success');
  const currentColor = useThemeColor({}, 'tint');
  const upcomingColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'textSecondary');

  if (steps.length === 0) {
    return (
      <Text style={{ color: secondaryColor, fontStyle: 'italic' }}>
        No executive approval gates apply to this deal.
      </Text>
    );
  }

  return (
    <View>
      {steps.map((step, index) => {
        const dotColor =
          step.status === 'done' ? doneColor : step.status === 'current' ? currentColor : upcomingColor;
        const isLast = index === steps.length - 1;

        return (
          <View key={step.id} style={styles.row}>
            <View style={styles.rail}>
              <View style={[styles.dot, { backgroundColor: dotColor }]} />
              {!isLast && <View style={[styles.line, { backgroundColor: upcomingColor }]} />}
            </View>
            <View style={styles.content}>
              <Text
                style={[
                  styles.label,
                  { color: textColor },
                  step.status === 'current' && styles.labelCurrent,
                ]}>
                {step.label}
              </Text>
              {step.status === 'done' && (
                <Text style={[styles.meta, { color: secondaryColor }]}>
                  Approved by {step.approver}
                  {step.timestamp ? ` · ${new Date(step.timestamp).toLocaleDateString()}` : ''}
                </Text>
              )}
              {step.status === 'current' && (
                <Text style={[styles.meta, { color: currentColor, fontWeight: '600' }]}>
                  Awaiting your decision
                </Text>
              )}
              {step.status === 'upcoming' && (
                <Text style={[styles.meta, { color: secondaryColor }]}>{step.role}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rail: {
    alignItems: 'center',
    width: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 24,
  },
  content: {
    flex: 1,
    paddingBottom: 16,
    paddingLeft: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
  labelCurrent: {
    fontWeight: '700',
  },
  meta: {
    fontSize: 13,
    marginTop: 2,
  },
});
