import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { errorText } from '@/api/errorText';
import type { TimelineAction } from '@/api/types';
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
          <Pressable
            style={[styles.button, styles.confirm]}
            onPress={confirm}
            disabled={deleteAction.isPending}
            accessibilityRole="button"
          >
            {deleteAction.isPending ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={styles.confirmLabel}>{DELETE_ACTION_LABEL.confirm}</Text>
            )}
          </Pressable>
          <Pressable
            style={[styles.button, styles.cancel]}
            onPress={close}
            disabled={deleteAction.isPending}
            accessibilityRole="button"
          >
            <Text style={styles.cancelLabel}>{DELETE_ACTION_LABEL.cancel}</Text>
          </Pressable>
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
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  confirm: {
    backgroundColor: colors.danger,
  },
  confirmLabel: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.onPrimary,
  },
  cancel: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelLabel: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
  },
});
