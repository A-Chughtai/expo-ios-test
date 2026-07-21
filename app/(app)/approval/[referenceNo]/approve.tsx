import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';
import { approveSaleOrder } from '@/lib/api/sale-orders';
import { ApiError } from '@/lib/api-client';

export default function ApproveSheet() {
  const { referenceNo, leadId } = useLocalSearchParams<{ referenceNo: string; leadId: string }>();
  const router = useRouter();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const background = useThemeColor({}, 'background');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'textSecondary');
  const success = useThemeColor({}, 'success');
  const danger = useThemeColor({}, 'danger');

  async function handleApprove() {
    setError(null);
    setIsSubmitting(true);
    try {
      await approveSaleOrder({
        foreignId: Number(leadId),
        foreignIdType: 'LEAD',
        vpcApproved: true,
      });
      router.dismissTo('/(app)/(tabs)');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not approve this deal.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>Approve {referenceNo}</Text>
        <Text style={{ color: secondaryColor, marginTop: 6 }}>
          This confirms your sign-off. The deal will move to its next stage immediately.
        </Text>

        <Text style={[styles.label, { color: secondaryColor }]}>Comment (optional)</Text>
        <TextInput
          style={[styles.input, { borderColor: border, color: textColor, backgroundColor: surface }]}
          value={comment}
          onChangeText={setComment}
          placeholder="Add a note for the record…"
          placeholderTextColor={secondaryColor}
          multiline
        />

        {error && <Text style={{ color: danger, marginTop: 12 }}>{error}</Text>}

        <Pressable
          style={[styles.confirmButton, { backgroundColor: success }]}
          disabled={isSubmitting}
          onPress={handleApprove}>
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Approve</Text>
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
  label: { fontSize: 13, fontWeight: '500', marginTop: 20, marginBottom: 6 },
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
