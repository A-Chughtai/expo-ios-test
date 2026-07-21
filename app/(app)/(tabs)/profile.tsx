import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useSession } from '@/contexts/session-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useState } from 'react';

export default function ProfileScreen() {
  const { user, signOut } = useSession();
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const background = useThemeColor({}, 'background');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'textSecondary');
  const tint = useThemeColor({}, 'tint');
  const danger = useThemeColor({}, 'danger');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <View style={styles.content}>
        <ThemedText type="title">Profile</ThemedText>

        <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
          <Text style={[styles.name, { color: textColor }]}>{user?.full_name}</Text>
          <Text style={{ color: secondaryColor }}>{user?.email}</Text>
          {user?.designation && (
            <Text style={[styles.role, { color: tint }]}>{user.designation.name}</Text>
          )}
        </View>

        <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: textColor, fontWeight: '600' }}>Biometric unlock</Text>
              <Text style={{ color: secondaryColor, fontSize: 12, marginTop: 2 }}>
                Not implemented in this POC — placeholder toggle only.
              </Text>
            </View>
            <Switch value={biometricEnabled} onValueChange={setBiometricEnabled} />
          </View>
        </View>

        <Pressable
          style={[styles.signOutButton, { borderColor: danger }]}
          onPress={() => signOut()}>
          <Text style={{ color: danger, fontWeight: '600' }}>Sign out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: 20, gap: 16 },
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    gap: 4,
  },
  name: { fontSize: 18, fontWeight: '700' },
  role: { fontWeight: '600', marginTop: 4 },
  settingRow: { flexDirection: 'row', alignItems: 'center' },
  signOutButton: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
});
