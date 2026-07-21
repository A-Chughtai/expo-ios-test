import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ReasonPicker } from '@/components/reason-picker';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ApiError } from '@/lib/api-client';
import { sendBack } from '@/lib/api/workflow';

const REASON_TEMPLATES = [
  'Needs revised commercials',
  'Missing documentation',
  'Clarify scope with customer',
  'Solution design incomplete',
];

export default function SendBackSheet() {
  const { referenceNo, leadId, stageId } = useLocalSearchParams<{
    referenceNo: string;
    leadId: string;
    stageId: string;
  }>();
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const background = useThemeColor({}, 'background');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'textSecondary');
  const tint = useThemeColor({}, 'tint');
  const danger = useThemeColor({}, 'danger');

  async function handleSendBack() {
    if (!reason.trim()) {
      setError('A comment is required to send this deal back.');
      return;
    }
    if (!stageId) {
      setError('Missing current stage for this deal — cannot send back.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await sendBack({
        foreignId: Number(leadId),
        foreignIdType: 'LEAD',
        workflowId: 1,
        workflowStageId: Number(stageId),
        reason: reason.trim(),
      });
      router.dismissTo('/(app)/(tabs)');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not send this deal back.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>Send back {referenceNo}</Text>
        <Text style={{ color: secondaryColor, marginTop: 6 }}>
          Returns the deal to a prior stage for rework. Explain what needs to be fixed.
        </Text>

        <Text style={[styles.label, { color: secondaryColor }]}>Comment (required)</Text>
        <ReasonPicker templates={REASON_TEMPLATES} onSelect={setReason} />
        <TextInput
          style={[styles.input, { borderColor: border, color: textColor, backgroundColor: surface }]}
          value={reason}
          onChangeText={setReason}
          placeholder="What needs to change before this can come back to you?"
          placeholderTextColor={secondaryColor}
          multiline
        />

        {error && <Text style={{ color: danger, marginTop: 12 }}>{error}</Text>}

        <Pressable
          style={[styles.confirmButton, { backgroundColor: tint, opacity: reason.trim() ? 1 : 0.6 }]}
          disabled={isSubmitting || !reason.trim()}
          onPress={handleSendBack}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Send back</Text>
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
