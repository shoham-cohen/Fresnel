import { StyleSheet, Text, View } from 'react-native';
import type { TimelineAction } from '@/api/types';
import { Avatar } from '@/components/Avatar';
import { Tag } from '@/components/Tag';
import { useUserName } from '@/hooks/useUserName';
import { colors, fontSize, spacing } from '@/theme';
import { formatTime } from '@/utils/formatTime';
import { RAIL_TOP, TimelineRail } from './TimelineRail';

type Props = {
  action: TimelineAction;
  at: string;
  isMine: boolean;
  isFirst: boolean;
  isLast: boolean;
};

export function TimelineItem({ action, at, isMine, isFirst, isLast }: Props) {
  const name = useUserName(action.performedBy);

  return (
    <View style={styles.row}>
      <TimelineRail
        marker={<Avatar name={name} isHighlighted={isMine} />}
        isFirst={isFirst}
        isLast={isLast}
      />
      <View style={[styles.content, !isLast && styles.divider]}>
        <View style={styles.meta}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.separator} />
          <Text style={styles.time}>{formatTime(at)}</Text>
        </View>
        <Tag label={action.actionTypeLabel} />
        <Text style={styles.title}>{action.title}</Text>
        {action.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {action.description}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
    paddingTop: RAIL_TOP,
    paddingBottom: spacing.lg,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 32,
  },
  name: {
    flexShrink: 1,
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  separator: {
    width: 1,
    height: 14,
    backgroundColor: colors.border,
  },
  time: {
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: fontSize.md,
    lineHeight: 22,
    color: colors.text,
  },
});
