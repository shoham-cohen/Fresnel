import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Tag } from '@/components/Tag';
import { ANOMALY_LABEL, STATUS_LABEL } from '@/constants/labels';
import { colors, fontSize, radius, severityColors, spacing, textAlignStart } from '@/theme';
import { formatTime } from '@/utils/formatTime';

import type { OpenEvent } from './types';

type Props = {
  event: OpenEvent;
};

export function EventRow({ event }: Props) {
  const hasTags = event.isAnomaly || event.status === 'in_progress';

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      // The event screen opens on its default tab, תמונת מצב.
      onPress={() => router.push({ pathname: '/events/[id]', params: { id: event.eventId } })}
      accessibilityRole="button"
    >
      <View style={[styles.severity, { backgroundColor: severityColors[event.severity] }]} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        {hasTags ? (
          <View style={styles.tags}>
            {event.isAnomaly ? <Tag label={ANOMALY_LABEL} tone="danger" /> : null}
            {event.status === 'in_progress' ? <Tag label={STATUS_LABEL.in_progress} /> : null}
          </View>
        ) : null}
      </View>
      <Text style={styles.time}>{formatTime(event.createdAt)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
    paddingEnd: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  pressed: {
    backgroundColor: colors.surface,
  },
  // A fixed length, so it is the same in every row whatever the title and tags take.
  severity: {
    width: 4,
    height: 36,
    borderRadius: radius.pill,
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    textAlign: textAlignStart,
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  time: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
});
