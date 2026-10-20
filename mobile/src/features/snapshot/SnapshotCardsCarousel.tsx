import { useRef, useState } from 'react';
import {
  Platform,
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

const TRACK_WIDTH = 140;
const INDICATOR_WIDTH = 60;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// How far the cards are scrolled, from 0 (the first card, on the right) to 1 (the last card).
// The app is RTL, and each platform reports a horizontal offset in RTL differently:
// web counts from 0 down to -max, Android from max down to 0, and iOS from 0 up to max.
function scrollProgress(offsetX: number, maxScroll: number) {
  if (maxScroll <= 0) return 0;
  const fromStart =
    Platform.OS === 'web' ? -offsetX : Platform.OS === 'android' ? maxScroll - offsetX : offsetX;
  return clamp(fromStart / maxScroll, 0, 1);
}

export function SnapshotCardsCarousel({ event, stats }: Props) {
  const trackWidthRef = useRef(TRACK_WIDTH);
  const [indicatorOffset, setIndicatorOffset] = useState(0);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const maxTrackOffset = Math.max(0, trackWidthRef.current - INDICATOR_WIDTH);
    const maxScrollDistance = Math.max(0, contentSize.width - layoutMeasurement.width);

    setIndicatorOffset(scrollProgress(contentOffset.x, maxScrollDistance) * maxTrackOffset);
  }

  function handleTrackLayout(e: { nativeEvent: { layout: { width: number } } }) {
    trackWidthRef.current = e.nativeEvent.layout.width || TRACK_WIDTH;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
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

      {/* A spacer before the bar, not `left`: row order follows RTL on every platform,
          while `left` means start on Android and iOS but the physical left on web. */}
      <View style={styles.indicatorTrack} onLayout={handleTrackLayout} pointerEvents="none">
        <View style={{ width: indicatorOffset }} />
        <View style={styles.indicatorBar} />
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
    flexDirection: 'row',
    width: TRACK_WIDTH,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.track,
    alignSelf: 'center',
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  indicatorBar: {
    width: INDICATOR_WIDTH,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.indicator,
  },
});
