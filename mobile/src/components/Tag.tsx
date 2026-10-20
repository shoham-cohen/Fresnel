import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';

type Props = {
  label: string;
  tone?: 'neutral' | 'danger';
};

export function Tag({ label, tone = 'neutral' }: Props) {
  return (
    <View style={[styles.tag, tone === 'danger' && styles.danger]}>
      <Text style={[styles.label, tone === 'danger' && styles.dangerLabel]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  danger: {
    backgroundColor: colors.dangerSurface,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  dangerLabel: {
    color: colors.danger,
  },
});
