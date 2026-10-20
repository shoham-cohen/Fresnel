import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '@/theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  isRequired?: boolean;
  isMultiline?: boolean;
};

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  maxLength,
  isRequired = false,
  isMultiline = false,
}: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {isRequired ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <TextInput
        style={[styles.input, isMultiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        maxLength={maxLength}
        multiline={isMultiline}
        textAlignVertical={isMultiline ? 'top' : 'center'}
        accessibilityLabel={label}
      />
      {maxLength ? (
        <Text style={styles.counter}>
          {value.length}/{maxLength}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  required: {
    color: colors.danger,
  },
  input: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    fontSize: fontSize.md,
    color: colors.text,
  },
  multiline: {
    minHeight: 88,
  },
  counter: {
    alignSelf: 'flex-end',
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});
