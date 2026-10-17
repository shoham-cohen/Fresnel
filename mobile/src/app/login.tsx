import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { Screen } from '@/components/Screen';
import { SCREEN_TITLE } from '@/constants/labels';
import { colors, fontSize, radius, spacing } from '@/theme';

export default function LoginScreen() {
  const { signIn } = useAuth();

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.title}>{SCREEN_TITLE.login}</Text>
        <Pressable style={styles.button} onPress={signIn} accessibilityRole="button">
          <Text style={styles.buttonLabel}>כניסה עם SSO</Text>
        </Pressable>
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
  buttonLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.onPrimary,
  },
});
