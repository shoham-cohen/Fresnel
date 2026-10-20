import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COMMON_LABEL } from '@/constants/labels';
import { colors, fontSize, radius, spacing } from '@/theme';

type Props = {
  message?: string;
  onRetry: () => void;
};

export function ErrorState({ message = COMMON_LABEL.loading, onRetry }: Props) {
  function handleRetry() {
    onRetry();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Pressable style={styles.button} onPress={handleRetry} accessibilityRole="button">
        <Text style={styles.buttonText}>{COMMON_LABEL.retry}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  message: {
    fontSize: fontSize.md,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    minWidth: 120,
    minHeight: 44,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  buttonText: {
    color: colors.onPrimary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
});

