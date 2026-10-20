import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { COMMON_LABEL } from '@/constants/labels';
import { colors, fontSize, spacing } from '@/theme';

type Props = {
  message?: string;
};

export function Loading({ message = COMMON_LABEL.loading }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
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
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
});

