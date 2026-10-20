import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import type { TopSource } from '@/api/types';
import { COMMON_LABEL, SNAPSHOT_LABEL } from '@/constants/labels';
import { colors, fontSize, radius, spacing } from '@/theme';

type Props = {
  sources?: TopSource[];
};

export function SourcesCard({ sources }: Props) {
  const hasSources = Boolean(sources && sources.length > 0);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="flame-outline" size={16} color={colors.navy} />
        <Text style={styles.headerTitle}>{SNAPSHOT_LABEL.topSources}</Text>
      </View>

      <View style={styles.listContainer}>
        {hasSources && sources ? (
          sources.map((item) => (
            <Text key={item.platform} style={styles.sourceItem} numberOfLines={1}>
              {item.platform}
            </Text>
          ))
        ) : (
          <Text style={styles.emptyText}>{COMMON_LABEL.empty}</Text>
        )}
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
    justifyContent: 'flex-start',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.navy,
    marginStart: spacing.xs,
  },
  listContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  sourceItem: {
    fontSize: fontSize.md,
    color: colors.navy,
    textAlign: 'center',
    marginVertical: 2,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

