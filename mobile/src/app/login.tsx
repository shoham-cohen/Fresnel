import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { Screen } from '@/components/Screen';
import { config } from '@/config';
import { LOGIN_LABEL, SCREEN_TITLE } from '@/constants/labels';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isConfigured = Boolean(config.keycloakIssuer && config.keycloakClientId);

  async function handleSignIn() {
    setIsPending(true);
    setError(null);
    try {
      // false = the user closed the browser; stay here without an error.
      await signIn();
    } catch {
      setError(LOGIN_LABEL.failed);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>{SCREEN_TITLE.login}</Text>
        <Pressable
          style={[styles.button, (isPending || !isConfigured) && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={isPending || !isConfigured}
          accessibilityRole="button"
          accessibilityState={{ disabled: isPending || !isConfigured, busy: isPending }}
        >
          {isPending ? (
            <ActivityIndicator color={colors.onPrimary} accessibilityLabel={LOGIN_LABEL.signingIn} />
          ) : (
            <Text style={styles.buttonLabel}>{LOGIN_LABEL.signIn}</Text>
          )}
        </Pressable>
        {!isConfigured && <Text style={styles.error}>{LOGIN_LABEL.notConfigured}</Text>}
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.xl,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
    textAlign: 'center',
  },
});
