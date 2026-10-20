import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { errorText } from '@/api/errorText';
import type { TimelineAction } from '@/api/types';
import { Button } from '@/components/Button';
import { Sheet } from '@/components/Sheet';
import { DELETE_ACTION_LABEL } from '@/constants/labels';
import { colors, fontSize, radius, spacing } from '@/theme';
import { useDeleteAction } from './useDeleteAction';

type Props = {
  eventId: string;
  action: TimelineAction | null;
  onClose: () => void;
};

const ERROR_BY_STATUS = {
  403: DELETE_ACTION_LABEL.notMine,
  404: DELETE_ACTION_LABEL.alreadyDeleted,
  409: DELETE_ACTION_LABEL.eventClosed,
};

export function DeleteActionSheet({ eventId, action, onClose }: Props) {
  const deleteAction = useDeleteAction(eventId);
  const [shownAction, setShownAction] = useState(action);
  if (action && action !== shownAction) setShownAction(action);

  const close = () => {
    deleteAction.reset();
    onClose();
  };

  const confirm = () => {
    if (!action) return;
    deleteAction.mutate(action.actionId, { onSuccess: close });
  };

  return (
    <Sheet isVisible={action !== null} onClose={close}>
      <View style={styles.body}>
        <Text style={styles.title}>{DELETE_ACTION_LABEL.title}</Text>
        <View style={styles.preview}>
          <Text style={styles.actionTitle} numberOfLines={2}>
            {shownAction?.title}
          </Text>
        </View>
        <Text style={styles.message}>{DELETE_ACTION_LABEL.message}</Text>
        {deleteAction.isError ? (
          <Text style={styles.error} accessibilityRole="alert">
            {errorText(deleteAction.error, ERROR_BY_STATUS)}
          </Text>
        ) : null}
        <View style={styles.buttons}>
          <Button
            label={DELETE_ACTION_LABEL.confirm}
            variant="danger"
            onPress={confirm}
            isLoading={deleteAction.isPending}
            style={styles.button}
          />
          <Button
            label={DELETE_ACTION_LABEL.cancel}
            variant="secondary"
            onPress={close}
            isDisabled={deleteAction.isPending}
            style={styles.button}
          />
        </View>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  preview: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  actionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  message: {
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  error: {
    fontSize: fontSize.md,
    color: colors.danger,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
  },
});
