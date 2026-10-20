import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ADD_ACTION_LABEL, COMMON_LABEL } from '@/constants/labels';
import { colors, fontSize, radius, spacing, textAlignStart } from '@/theme';
import { useActionTypes } from './useActionTypes';

type Props = {
  value: string;
  onChange: (code: string) => void;
};

const OPTION_HEIGHT = 44;
const MAX_VISIBLE_OPTIONS = 5;

export function ActionTypePicker({ value, onChange }: Props) {
  const actionTypes = useActionTypes();
  const [isOpen, setIsOpen] = useState(false);
  const selected = actionTypes.data?.find((type) => type.code === value);

  const select = (code: string) => {
    onChange(code);
    setIsOpen(false);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {ADD_ACTION_LABEL.type}
        <Text style={styles.required}> *</Text>
      </Text>
      {actionTypes.isError ? (
        <View style={styles.errorRow}>
          <Text style={styles.error}>{ADD_ACTION_LABEL.typesError}</Text>
          <Pressable onPress={() => actionTypes.refetch()} accessibilityRole="button" hitSlop={8}>
            <Text style={styles.retry}>{COMMON_LABEL.retry}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.anchor}>
          <Pressable
            style={[styles.trigger, isOpen && styles.triggerOpen]}
            onPress={() => setIsOpen((current) => !current)}
            disabled={!actionTypes.data}
            accessibilityRole="button"
            accessibilityLabel={ADD_ACTION_LABEL.type}
            aria-expanded={isOpen}
          >
            <Text style={[styles.value, !selected && styles.placeholder]} numberOfLines={1}>
              {selected?.labelHe ?? ADD_ACTION_LABEL.typePlaceholder}
            </Text>
            {actionTypes.isPending ? (
              <ActivityIndicator size="small" color={colors.textMuted} />
            ) : (
              <Ionicons
                name={isOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={isOpen ? colors.primary : colors.textMuted}
              />
            )}
          </Pressable>
          {isOpen && actionTypes.data ? (
            <View style={styles.menu}>
              <ScrollView
                style={{ maxHeight: OPTION_HEIGHT * MAX_VISIBLE_OPTIONS }}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                {actionTypes.data.map((type, index) => {
                  const isSelected = type.code === value;
                  return (
                    <Pressable
                      key={type.code}
                      style={({ pressed }) => [
                        styles.option,
                        index > 0 && styles.optionDivider,
                        isSelected && styles.optionSelected,
                        pressed && styles.optionPressed,
                      ]}
                      onPress={() => select(type.code)}
                      accessibilityRole="radio"
                      accessibilityLabel={type.labelHe}
                      aria-checked={isSelected}
                    >
                      <Text
                        style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}
                        numberOfLines={1}
                      >
                        {type.labelHe}
                      </Text>
                      {isSelected ? (
                        <Ionicons name="checkmark" size={18} color={colors.primary} />
                      ) : null}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
    zIndex: 10,
  },
  anchor: {
    zIndex: 10,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  required: {
    color: colors.danger,
  },
  trigger: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  triggerOpen: {
    borderColor: colors.primary,
  },
  value: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    textAlign: textAlignStart,
  },
  placeholder: {
    color: colors.textMuted,
  },
  menu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: spacing.xs,
    zIndex: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.input,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  option: {
    height: OPTION_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  optionDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  optionSelected: {
    backgroundColor: colors.surface,
  },
  optionPressed: {
    backgroundColor: colors.surface,
  },
  optionLabel: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    textAlign: textAlignStart,
  },
  optionLabelSelected: {
    fontWeight: '700',
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
