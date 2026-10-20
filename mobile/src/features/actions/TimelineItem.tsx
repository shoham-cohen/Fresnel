import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TimelineAction } from '@/api/types';
import { Avatar } from '@/components/Avatar';
import { DELETE_ACTION_LABEL } from '@/constants/labels';
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
  onDelete?: () => void;
};

export function TimelineItem({ action, at, isMine, isFirst, isLast, onDelete }: Props) {
  const name = useUserName(action.performedBy);
  const [isExpanded, setIsExpanded] = useState(false);
  const canExpand = Boolean(action.description);

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && (canExpand || onDelete) && styles.pressed]}
      onPress={canExpand ? () => setIsExpanded((current) => !current) : undefined}
      onLongPress={onDelete}
      disabled={!canExpand && !onDelete}
      accessibilityState={canExpand ? { expanded: isExpanded } : undefined}
    >
      <TimelineRail
        marker={<Avatar name={name} isHighlighted={isMine} />}
        isFirst={isFirst}
        isLast={isLast}
      />
      <View style={[styles.content, !isLast && styles.divider]}>
        <View style={styles.meta}>
          <View style={styles.who}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <View style={styles.separator} />
            <Text style={styles.time}>{formatTime(at)}</Text>
          </View>
          {onDelete ? (
            <Pressable
              style={styles.delete}
              onPress={onDelete}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={DELETE_ACTION_LABEL.button}
            >
              <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.title}>{action.title}</Text>
        {action.description ? (
          <Text style={styles.description} numberOfLines={isExpanded ? undefined : 2}>
            {action.description}
          </Text>
        ) : null}
      </View>
    </Pressable>
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
  who: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  delete: {
    padding: spacing.xs,
  },
  pressed: {
    opacity: 0.6,
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
