import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { AVATAR_SIZE } from '@/components/Avatar';
import { colors, spacing } from '@/theme';

export const RAIL_TOP = spacing.lg;

type Props = {
  marker: ReactNode;
  isFirst: boolean;
  isLast: boolean;
};

export function TimelineRail({ marker, isFirst, isLast }: Props) {
  return (
    <View style={styles.rail}>
      <View style={[styles.line, styles.top, isFirst && styles.hidden]} />
      {marker}
      <View style={[styles.line, styles.bottom, isLast && styles.hidden]} />
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    width: AVATAR_SIZE,
    alignItems: 'center',
  },
  line: {
    width: 2,
    backgroundColor: colors.border,
  },
  top: {
    height: RAIL_TOP,
  },
  bottom: {
    flex: 1,
  },
  hidden: {
    opacity: 0,
  },
});
