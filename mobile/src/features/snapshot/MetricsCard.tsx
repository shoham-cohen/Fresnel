import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { SNAPSHOT_LABEL } from '@/constants/labels';
import { colors, fontSize, radius, spacing } from '@/theme';
import { formatNumber } from './formatters';

type Props = {
  posts?: number | null;
  views?: number | null;
};

export function MetricsCard({ posts, views }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.metricGroup}>
        <View style={styles.headerRow}>
          <Ionicons name="document-text-outline" size={16} color={colors.navy} />
          <Text style={styles.metricLabel}>{SNAPSHOT_LABEL.totalPosts}</Text>
        </View>
        <Text style={styles.metricValue}>{formatNumber(posts)}</Text>
      </View>

      <View style={styles.metricGroup}>
        <View style={styles.headerRow}>
          <Ionicons name="eye-outline" size={16} color={colors.navy} />
          <Text style={styles.metricLabel}>{SNAPSHOT_LABEL.totalViews}</Text>
        </View>
        <Text style={styles.metricValue}>{formatNumber(views)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 190,
    minHeight: 165,
    backgroundColor: colors.cardBackground,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricGroup: {
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  metricLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.navy,
    marginStart: spacing.xs,
  },
  metricValue: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.navy,
    textAlign: 'center',
  },
});

