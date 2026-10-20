import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { ADD_ACTION_LABEL, COMMON_LABEL } from '@/constants/labels';
import { colors, fontSize, radius, spacing } from '@/theme';
import { useActionTypes } from './useActionTypes';

type Props = {
  value: string;
  onChange: (code: string) => void;
};

export function ActionTypePicker({ value, onChange }: Props) {
  const actionTypes = useActionTypes();

  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {ADD_ACTION_LABEL.type}
        <Text style={styles.required}> *</Text>
      </Text>
      {actionTypes.isPending ? <ActivityIndicator color={colors.primary} /> : null}
      {actionTypes.isError ? (
        <View style={styles.errorRow}>
          <Text style={styles.error}>{ADD_ACTION_LABEL.typesError}</Text>
          <Pressable onPress={() => actionTypes.refetch()} accessibilityRole="button" hitSlop={8}>
            <Text style={styles.retry}>{COMMON_LABEL.retry}</Text>
          </Pressable>
        </View>
      ) : null}
      {actionTypes.data ? (
        <View style={styles.chips} accessibilityRole="radiogroup">
          {actionTypes.data.map((type) => {
            const isSelected = type.code === value;
            return (
              <Pressable
                key={type.code}
                style={[styles.chip, isSelected && styles.selectedChip]}
                onPress={() => onChange(type.code)}
                accessibilityRole="radio"
                accessibilityLabel={type.labelHe}
                accessibilityState={{ checked: isSelected }}
              >
                <Text style={[styles.chipLabel, isSelected && styles.selectedChipLabel]}>
                  {type.labelHe}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  required: {
    color: colors.danger,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  selectedChip: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  chipLabel: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
  selectedChipLabel: {
    color: colors.onPrimary,
    fontWeight: '600',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.danger,
  },
  retry: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
});
