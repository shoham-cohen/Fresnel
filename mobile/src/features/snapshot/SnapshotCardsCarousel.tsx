import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import type { EventDetail, Stats } from '@/api/types';
import { colors, radius, spacing } from '@/theme';
import { EventInfoCard } from './EventInfoCard';
import { MetricsCard } from './MetricsCard';
import { SourcesCard } from './SourcesCard';

type Props = {
  event: EventDetail;
  stats?: Stats;
};

export function SnapshotCardsCarousel({ event, stats }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const maxScroll = contentSize.width - layoutMeasurement.width;
    if (maxScroll > 0) {
      const progress = Math.min(Math.max(Math.abs(contentOffset.x) / maxScroll, 0), 1);
      setScrollProgress(progress);
    }
  }

  const indicatorTranslateX = scrollProgress * 70;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.cardWrapper}>
          <EventInfoCard
            title={event.title}
            detectedAt={event.detectedAt}
            updatedAt={event.updatedAt}
          />
        </View>

        <View style={styles.cardWrapper}>
          <MetricsCard posts={stats?.posts} views={stats?.views} />
        </View>

        <View style={styles.cardWrapper}>
          <SourcesCard sources={stats?.topSources} />
        </View>
      </ScrollView>

      <View style={styles.indicatorTrack}>
        <View style={[styles.indicatorBar, { transform: [{ translateX: indicatorTranslateX }] }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    minHeight: 220,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 175,
  },
  cardWrapper: {
    marginEnd: spacing.md,
  },
  indicatorTrack: {
    width: 140,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.track,
    alignSelf: 'center',
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  indicatorBar: {
    width: 70,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.indicator,
  },
});
