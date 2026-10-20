import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { errorText } from '@/api/errorText';
import { useAuth } from '@/auth/AuthProvider';
import { AnonymousAvatar } from '@/components/AnonymousAvatar';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { LOGIN_LABEL } from '@/constants/labels';
import { colors, fontSize, radius, spacing } from '@/theme';

const AVATAR_SIZE = 128;
const AVATAR_RING = 6;

export default function LoginScreen() {
  const { signIn, isSigningIn, signInError } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <Screen edges={['bottom']}>
      <StatusBar style="light" />
      <View style={[styles.band, { paddingTop: insets.top + spacing.xxl }]}>
        <Text style={styles.appName}>{LOGIN_LABEL.appName}</Text>
        <Text style={styles.appSubtitle}>{LOGIN_LABEL.appSubtitle}</Text>
      </View>

      <View style={styles.avatarRing}>
        <AnonymousAvatar size={AVATAR_SIZE} />
      </View>

      <View style={styles.body}>
        <View style={styles.texts}>
          <Text style={styles.welcome}>{LOGIN_LABEL.welcome}</Text>
          <Text style={styles.description}>{LOGIN_LABEL.description}</Text>
        </View>

        <View style={styles.actions}>
          <Button
            label={LOGIN_LABEL.sso}
            icon="key-outline"
            onPress={signIn}
            isLoading={isSigningIn}
            style={styles.button}
          />
          {signInError ? (
            <Text style={styles.error} accessibilityLiveRegion="polite">
              {errorText(signInError)}
            </Text>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}

const ringSize = AVATAR_SIZE + AVATAR_RING * 2;

const styles = StyleSheet.create({
  band: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingBottom: ringSize / 2 + spacing.xl,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.header,
    borderBottomLeftRadius: radius.lg * 2,
    borderBottomRightRadius: radius.lg * 2,
  },
  appName: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.onHeader,
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: fontSize.md,
    color: colors.tabs,
  },
  avatarRing: {
    alignSelf: 'center',
    width: ringSize,
    height: ringSize,
    borderRadius: ringSize / 2,
    marginTop: -ringSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.xl,
    paddingTop: spacing.xl,
  },
  texts: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  welcome: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.md,
    lineHeight: 22,
    color: colors.textMuted,
    textAlign: 'center',
  },
  actions: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  button: {
    minHeight: 52,
    borderRadius: radius.md,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
    textAlign: 'center',
  },
});
