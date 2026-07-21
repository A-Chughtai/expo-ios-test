import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useSession } from '@/contexts/session-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DEMO_ACCOUNTS } from '@/lib/demo-accounts';

export default function SignInScreen() {
  const { signIn } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tint = useThemeColor({}, 'tint');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'textSecondary');
  const danger = useThemeColor({}, 'danger');
  const background = useThemeColor({}, 'background');

  async function handleSignIn(u: string, p: string) {
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(u, p);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <View style={styles.content}>
          <ThemedText type="title" style={[styles.title, { color: tint }]}>
            ATOM Approvals
          </ThemedText>
          <ThemedText style={{ color: secondaryColor, marginBottom: 32 }}>
            Sign in to review deals awaiting your approval.
          </ThemedText>

          <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
            <Text style={[styles.fieldLabel, { color: secondaryColor }]}>Username</Text>
            <TextInput
              style={[styles.input, { borderColor: border, color: textColor }]}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="username"
              placeholderTextColor={secondaryColor}
            />
            <Text style={[styles.fieldLabel, { color: secondaryColor, marginTop: 16 }]}>
              Password
            </Text>
            <TextInput
              style={[styles.input, { borderColor: border, color: textColor }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="password"
              placeholderTextColor={secondaryColor}
            />

            {error && <Text style={[styles.error, { color: danger }]}>{error}</Text>}

            <Pressable
              style={[styles.button, { backgroundColor: tint }]}
              disabled={isSubmitting || !username || !password}
              onPress={() => handleSignIn(username, password)}>
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign in</Text>
              )}
            </Pressable>
          </View>

          {DEMO_ACCOUNTS.length > 0 && (
            <View style={styles.quickLogin}>
              <Text style={[styles.fieldLabel, { color: secondaryColor }]}>
                Quick sign in as…
              </Text>
              <View style={styles.quickLoginRow}>
                {DEMO_ACCOUNTS.map((account) => (
                  <Pressable
                    key={account.role}
                    style={[styles.roleChip, { borderColor: tint }]}
                    disabled={isSubmitting}
                    onPress={() => handleSignIn(account.username, account.password)}>
                    <Text style={[styles.roleChipText, { color: tint }]}>{account.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { marginBottom: 4 },
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, padding: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: { marginTop: 12, fontSize: 13 },
  button: {
    marginTop: 24,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  quickLogin: { marginTop: 28 },
  quickLoginRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleChip: {
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  roleChipText: { fontWeight: '600', fontSize: 14 },
});
