import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';

const RINGS = [
  { scale: 1, width: 2, color: colors.border },
  { scale: 0.76, width: 3, color: colors.primary },
  { scale: 0.54, width: 2, color: colors.border },
  { scale: 0.34, width: 0, color: colors.primary },
] as const;

type Props = {
  size?: number;
};

export function FresnelLogo({ size = 112 }: Props) {
  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {RINGS.map((ring) => {
        const diameter = size * ring.scale;
        return (
          <View
            key={ring.scale}
            style={[
              styles.ring,
              {
                width: diameter,
                height: diameter,
                borderRadius: diameter / 2,
                borderWidth: ring.width,
                borderColor: ring.color,
                backgroundColor: ring.width === 0 ? ring.color : undefined,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
  ring: {
    position: 'absolute',
  },
});
