import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, spacing } from '@/theme';

type Props = {
  text: string;
};

export function EmptyState({ text }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
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
  text: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

