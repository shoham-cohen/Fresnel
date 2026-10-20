import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COMMON_LABEL } from '@/constants/labels';
import { colors, fontSize, radius, spacing } from '@/theme';

type Props = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={40} color={colors.textMuted} />
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable style={styles.retry} onPress={onRetry} accessibilityRole="button">
          <Text style={styles.retryLabel}>{COMMON_LABEL.retry}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  message: {
    fontSize: fontSize.md,
    color: colors.text,
    textAlign: 'center',
  },
  retry: {
    minHeight: 40,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  retryLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
  },
});
