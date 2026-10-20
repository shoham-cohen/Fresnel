import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme';

type Props = {
  size?: number;
};

// The default "no photo" avatar: a light head and shoulders on a dark gray circle.
// Drawn from plain views: a head circle, and a larger circle for the shoulders, cut by the frame.
export function AnonymousAvatar({ size = 120 }: Props) {
  const head = size * 0.38;
  const body = size * 0.76;

  return (
    <View
      style={[styles.frame, { width: size, height: size, borderRadius: size / 2 }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View
        style={[
          styles.figure,
          {
            width: head,
            height: head,
            borderRadius: head / 2,
            top: size * 0.18,
            left: (size - head) / 2,
          },
        ]}
      />
      <View
        style={[
          styles.figure,
          {
            width: body,
            height: body,
            borderRadius: body / 2,
            top: size * 0.62,
            left: (size - body) / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    backgroundColor: colors.avatarBackground,
  },
  figure: {
    position: 'absolute',
    backgroundColor: colors.avatarFigure,
  },
});
