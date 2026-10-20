import { StyleSheet, Text, View } from 'react-native';

import { SNAPSHOT_LABEL } from '@/constants/labels';
import { colors, fontSize, radius, spacing } from '@/theme';
import { formatDateTime } from './formatters';

type Props = {
  title?: string;
  detectedAt?: string | null;
  updatedAt?: string | null;
};

export function EventInfoCard({ title, detectedAt, updatedAt }: Props) {
  const displayTitle = title?.trim() || SNAPSHOT_LABEL.eventTitle;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {displayTitle}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{SNAPSHOT_LABEL.detectedAt}</Text>
        <Text style={styles.timestamp}>{formatDateTime(detectedAt)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{SNAPSHOT_LABEL.updatedAt}</Text>
        <Text style={styles.timestamp}>{formatDateTime(updatedAt)}</Text>
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
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  section: {
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.navy,
    marginBottom: 2,
    textAlign: 'center',
  },
  timestamp: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

