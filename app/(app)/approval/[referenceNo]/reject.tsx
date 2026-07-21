import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReasonPicker } from '@/components/reason-picker';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ApiError } from '@/lib/api-client';
import { rejectLead } from '@/lib/api/leads';

const REASON_TEMPLATES = [
  'Margin below threshold',
  'Pricing not competitive',
  'Customer risk profile',
  'Duplicate deal',
];

export default function RejectSheet() {
  const { referenceNo, leadId } = useLocalSearchParams<{ referenceNo: string; leadId: string }>();
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const background = useThemeColor({}, 'background');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'textSecondary');
  const danger = useThemeColor({}, 'danger');

  async function handleReject() {
    if (!reason.trim()) {
      setError('A reason is required to reject this deal.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await rejectLead(Number(leadId));
      router.dismissTo('/(app)/(tabs)');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not reject this deal.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>Reject {referenceNo}</Text>
        <Text style={{ color: secondaryColor, marginTop: 6 }}>
          This stops the deal. This action is terminal for your approval step.
        </Text>

        <Text style={[styles.label, { color: secondaryColor }]}>Reason (required)</Text>
        <ReasonPicker templates={REASON_TEMPLATES} onSelect={setReason} />
        <TextInput
          style={[styles.input, { borderColor: border, color: textColor, backgroundColor: surface }]}
          value={reason}
          onChangeText={setReason}
          placeholder="Explain why this deal is being rejected…"
          placeholderTextColor={secondaryColor}
          multiline
        />

        {error && <Text style={{ color: danger, marginTop: 12 }}>{error}</Text>}

        <Pressable
          style={[styles.confirmButton, { backgroundColor: danger, opacity: reason.trim() ? 1 : 0.6 }]}
          disabled={isSubmitting || !reason.trim()}
          onPress={handleReject}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Reject</Text>
          )}
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={{ color: secondaryColor }}>Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 20, fontWeight: '700' },
  label: { fontSize: 13, fontWeight: '500', marginTop: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    minHeight: 90,
    textAlignVertical: 'top',
    fontSize: 15,
  },
  confirmButton: {
    marginTop: 24,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  confirmText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelButton: { marginTop: 12, alignItems: 'center', paddingVertical: 10 },
});
