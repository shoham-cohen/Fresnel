import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { ApiError } from '@/api/client';
import { errorText } from '@/api/errorText';
import { Button } from '@/components/Button';
import { Sheet } from '@/components/Sheet';
import { TextField } from '@/components/TextField';
import { ADD_ACTION_LABEL, COMMON_LABEL } from '@/constants/labels';
import { colors, fontSize, spacing } from '@/theme';
import { ActionTypePicker } from './ActionTypePicker';
import { useCreateAction } from './useCreateAction';

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 500;
const EMPTY_FORM = { actionType: '', title: '', description: '' };

type Props = {
  eventId: string;
  isVisible: boolean;
  onClose: () => void;
};

export function AddActionSheet({ eventId, isVisible, onClose }: Props) {
  const { height } = useWindowDimensions();
  const [form, setForm] = useState(EMPTY_FORM);
  const createAction = useCreateAction(eventId);

  const isEventClosed = createAction.error instanceof ApiError && createAction.error.status === 409;
  const isValid =
    form.actionType !== '' && form.title.trim() !== '' && form.description.trim() !== '';

  const close = () => {
    setForm(EMPTY_FORM);
    createAction.reset();
    onClose();
  };

  const submit = () => {
    createAction.mutate(
      {
        actionType: form.actionType,
        title: form.title.trim(),
        description: form.description.trim(),
      },
      { onSuccess: close },
    );
  };

  const goHome = () => {
    close();
    router.dismissTo('/');
  };

  return (
    <Sheet isVisible={isVisible} onClose={close}>
      <ScrollView
        style={{ maxHeight: height * 0.8 }}
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>{ADD_ACTION_LABEL.title}</Text>
        {isVisible ? (
          <ActionTypePicker
            value={form.actionType}
            onChange={(actionType) => setForm((current) => ({ ...current, actionType }))}
          />
        ) : null}
        <TextField
          label={ADD_ACTION_LABEL.actionTitle}
          placeholder={ADD_ACTION_LABEL.actionTitlePlaceholder}
          value={form.title}
          onChangeText={(title) => setForm((current) => ({ ...current, title }))}
          maxLength={TITLE_MAX}
          isRequired
        />
        <TextField
          label={ADD_ACTION_LABEL.description}
          placeholder={ADD_ACTION_LABEL.descriptionPlaceholder}
          value={form.description}
          onChangeText={(description) => setForm((current) => ({ ...current, description }))}
          maxLength={DESCRIPTION_MAX}
          isRequired
          isMultiline
        />
        {createAction.isError ? (
          <Text style={styles.error} accessibilityRole="alert">
            {errorText(createAction.error, { 409: ADD_ACTION_LABEL.eventClosed })}
          </Text>
        ) : null}
        {isEventClosed ? (
          <Button label={COMMON_LABEL.backHome} onPress={goHome} />
        ) : (
          <Button
            label={ADD_ACTION_LABEL.submit}
            onPress={submit}
            isDisabled={!isValid}
            isLoading={createAction.isPending}
          />
        )}
      </ScrollView>
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
  error: {
    fontSize: fontSize.md,
    color: colors.danger,
  },
});
