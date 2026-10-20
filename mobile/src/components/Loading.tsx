import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { COMMON_LABEL } from '@/constants/labels';
import { colors } from '@/theme';

export function Loading() {
  return (
    <View style={styles.container} accessibilityLabel={COMMON_LABEL.loading}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
