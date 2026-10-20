import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, fontSize, radius, spacing } from '@/theme';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  icon?: ComponentProps<typeof Ionicons>['name'];
  isLoading?: boolean;
  isDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const BACKGROUND: Record<Variant, string> = {
  primary: colors.primary,
  secondary: colors.background,
  danger: colors.danger,
};

const FOREGROUND: Record<Variant, string> = {
  primary: colors.onPrimary,
  secondary: colors.text,
  danger: colors.onPrimary,
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  isLoading = false,
  isDisabled = false,
  style,
}: Props) {
  const isInactive = isDisabled || isLoading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: BACKGROUND[variant] },
        variant === 'secondary' && styles.outline,
        isDisabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={isInactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isInactive, busy: isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator color={FOREGROUND[variant]} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={FOREGROUND[variant]} /> : null}
          <Text style={[styles.label, { color: FOREGROUND[variant] }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
