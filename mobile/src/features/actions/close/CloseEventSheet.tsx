import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ApiError } from '@/api/client';
import { errorText } from '@/api/errorText';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/Button';
import { Sheet } from '@/components/Sheet';
import { TextField } from '@/components/TextField';
import { CLOSE_EVENT_LABEL, COMMON_LABEL } from '@/constants/labels';
import { colors, fontSize, radius, spacing } from '@/theme';
import { useCloseEvent } from './useCloseEvent';

type Props = {
  eventId: string;
  isVisible: boolean;
  onClose: () => void;
};

export function CloseEventSheet({ eventId, isVisible, onClose }: Props) {
  const { user } = useAuth();
  const [summary, setSummary] = useState('');
  const closeEvent = useCloseEvent(eventId);

  const isAlreadyClosed = closeEvent.error instanceof ApiError && closeEvent.error.status === 409;

  const close = () => {
    setSummary('');
    closeEvent.reset();
    onClose();
  };

  const goHome = () => {
    close();
    router.dismissTo('/');
  };

  const submit = () => {
    if (!user) return;
    closeEvent.mutate({ closureSummary: summary.trim(), closedBy: user.id }, { onSuccess: goHome });
  };

  return (
    <Sheet isVisible={isVisible} onClose={close}>
      <View style={styles.body}>
        <Text style={styles.title}>{CLOSE_EVENT_LABEL.title}</Text>
        <View style={styles.warning}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <Text style={styles.warningText}>{CLOSE_EVENT_LABEL.warning}</Text>
        </View>
        <TextField
          label={CLOSE_EVENT_LABEL.summary}
          placeholder={CLOSE_EVENT_LABEL.summaryPlaceholder}
          value={summary}
          onChangeText={setSummary}
          isRequired
          isMultiline
        />
        {closeEvent.isError ? (
          <Text style={styles.error} accessibilityRole="alert">
            {errorText(closeEvent.error, { 409: CLOSE_EVENT_LABEL.alreadyClosed })}
          </Text>
        ) : null}
        {isAlreadyClosed ? (
          <Button label={COMMON_LABEL.backHome} onPress={goHome} />
        ) : (
          <Button
            label={CLOSE_EVENT_LABEL.submit}
            onPress={submit}
            isDisabled={summary.trim() === ''}
            isLoading={closeEvent.isPending}
          />
        )}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: spacing.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  warningText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
  },
  error: {
    fontSize: fontSize.md,
    color: colors.danger,
  },
});
