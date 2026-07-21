import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="approval/[referenceNo]" options={{ title: 'Approval detail' }} />
      <Stack.Screen
        name="approval/[referenceNo]/approve"
        options={{ presentation: 'formSheet', title: 'Approve' }}
      />
      <Stack.Screen
        name="approval/[referenceNo]/reject"
        options={{ presentation: 'formSheet', title: 'Reject' }}
      />
      <Stack.Screen
        name="approval/[referenceNo]/send-back"
        options={{ presentation: 'formSheet', title: 'Send back' }}
      />
    </Stack>
  );
}
