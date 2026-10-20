import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize } from '@/theme';

type Props = {
  name: string;
  isHighlighted?: boolean;
};

export const AVATAR_SIZE = 32;

function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return words[0][0] + words[1][0];
  return name.slice(0, 2);
}

export function Avatar({ name, isHighlighted = false }: Props) {
  return (
    <View style={[styles.circle, isHighlighted && styles.highlighted]}>
      <Text style={[styles.initials, isHighlighted && styles.highlightedInitials]}>
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  highlighted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  initials: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primary,
  },
  highlightedInitials: {
    color: colors.onPrimary,
  },
});
