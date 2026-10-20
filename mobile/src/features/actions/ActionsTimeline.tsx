import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import { errorText } from '@/api/errorText';
import type { TimelineAction, TimelineEntry } from '@/api/types';
import { useAuth } from '@/auth/AuthProvider';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { FresnelLogo } from '@/components/FresnelLogo';
import { Loading } from '@/components/Loading';
import { ACTIONS_LABEL, EVENT_TAB_LABEL } from '@/constants/labels';
import { useManualRefresh } from '@/hooks/useManualRefresh';
import { colors, fontSize, spacing } from '@/theme';
import { DeleteActionSheet } from './delete/DeleteActionSheet';
import { TimelineItem } from './TimelineItem';
import { TimelineSystemRow } from './TimelineSystemRow';
import { useTimeline } from './useTimeline';

type Props = {
  eventId: string;
};

const keyOf = (entry: TimelineEntry) => entry.action?.actionId ?? `${entry.kind}-${entry.at}`;

const ERROR_BY_STATUS = {
  403: ACTIONS_LABEL.forbidden,
  404: ACTIONS_LABEL.notFound,
};

export function ActionsTimeline({ eventId }: Props) {
  const { user } = useAuth();
  const timeline = useTimeline(eventId);
  const { isRefreshing, onRefresh } = useManualRefresh(timeline.refetch);
  const [actionToDelete, setActionToDelete] = useState<TimelineAction | null>(null);

  if (timeline.isPending) return <Loading />;
  if (timeline.isError) {
    return (
      <ErrorState
        message={errorText(timeline.error, ERROR_BY_STATUS)}
        onRetry={() => timeline.refetch()}
      />
    );
  }

  const entries = timeline.data;
  const actionCount = entries.filter((entry) => entry.kind === 'action').length;

  return (
    <>
      <FlatList
        data={actionCount > 0 ? entries : []}
        keyExtractor={keyOf}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <Text style={styles.title}>
            {EVENT_TAB_LABEL.actions} ({actionCount})
          </Text>
        }
        ListEmptyComponent={<EmptyState icon={<FresnelLogo />} title={ACTIONS_LABEL.empty} />}
        renderItem={({ item, index }) => {
          const position = { isFirst: index === 0, isLast: index === entries.length - 1 };
          if (item.kind !== 'action') {
            return (
              <TimelineSystemRow
                kind={item.kind}
                at={item.at}
                actorId={item.actorId}
                {...position}
              />
            );
          }
          const action = item.action;
          if (!action) return null;
          const isMine = action.performedBy === user?.id;
          return (
            <TimelineItem
              action={action}
              at={item.at}
              isMine={isMine}
              onDelete={isMine ? () => setActionToDelete(action) : undefined}
              {...position}
            />
          );
        }}
      />
      <DeleteActionSheet
        eventId={eventId}
        action={actionToDelete}
        onClose={() => setActionToDelete(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
