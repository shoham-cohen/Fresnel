import { StyleSheet, Text, View } from 'react-native';
import type { TimelineEntry } from '@/api/types';
import { TIMELINE_EVENT_LABEL } from '@/constants/labels';
import { useUserName } from '@/hooks/useUserName';
import { colors, fontSize, spacing } from '@/theme';
import { formatTime } from '@/utils/formatTime';
import { RAIL_TOP, TimelineRail } from './TimelineRail';

type Props = {
  kind: Exclude<TimelineEntry['kind'], 'action'>;
  at: string;
  actorId: string;
  isFirst: boolean;
  isLast: boolean;
};

export function TimelineSystemRow({ kind, at, actorId, isFirst, isLast }: Props) {
  const name = useUserName(actorId);

  return (
    <View style={styles.row}>
      <TimelineRail marker={<View style={styles.dot} />} isFirst={isFirst} isLast={isLast} />
      <Text style={styles.text}>
        {[TIMELINE_EVENT_LABEL[kind], name, formatTime(at)].join(' · ')}
      </Text>
    </View>
  );
}

const DOT_SIZE = 10;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.border,
  },
  text: {
    flex: 1,
    paddingTop: RAIL_TOP - 4,
    paddingBottom: spacing.lg,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
