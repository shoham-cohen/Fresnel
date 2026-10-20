import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { SNAPSHOT_LABEL } from '@/constants/labels';
import { colors } from '@/theme';
import { SnapshotCardsCarousel } from '@/features/snapshot/SnapshotCardsCarousel';
import { useEventSnapshot } from '@/features/snapshot/useEventSnapshot';

export default function SnapshotScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { event, stats, isLoading, isError, refetch } = useEventSnapshot(id ?? '');

  if (isLoading) {
    return <Loading />;
  }
  if (isError || !event) {
    return <ErrorState message={SNAPSHOT_LABEL.errorLoading} onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <SnapshotCardsCarousel event={event} stats={stats} />

      {/* Reserved space for future Oracle web component */}
      <View style={styles.webComponentSlot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webComponentSlot: {
    flex: 1,
  },
});
