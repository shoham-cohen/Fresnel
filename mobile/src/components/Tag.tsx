import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, spacing } from '@/theme';

type Props = {
  label: string;
};

export function Tag({ label }: Props) {
  return (
    <View style={styles.tag}>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.primary,
  },
});
