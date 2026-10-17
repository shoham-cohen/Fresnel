import { Slot, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { EventTabs } from '@/components/EventTabs';
import { colors } from '@/theme';

export default function EventLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <EventTabs eventId={id} />
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
