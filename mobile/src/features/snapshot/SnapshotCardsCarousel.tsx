import { useRef, useState } from 'react';
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

const TRACK_WIDTH = 140;
const INDICATOR_WIDTH = 60;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function SnapshotCardsCarousel({ event, stats }: Props) {
  const scrollViewRef = useRef<ScrollView>(null);
  const trackWidthRef = useRef(TRACK_WIDTH);
  const [indicatorOffset, setIndicatorOffset] = useState(0);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const scrollX = e.nativeEvent.contentOffset.x;
    const contentWidth = e.nativeEvent.contentSize.width;
    const viewportWidth = e.nativeEvent.layoutMeasurement.width;
    const maxTrackOffset = Math.max(0, trackWidthRef.current - INDICATOR_WIDTH);
    const maxScrollDistance = Math.max(0, contentWidth - viewportWidth);

    if (maxScrollDistance <= 0 || maxTrackOffset <= 0) {
      setIndicatorOffset(0);
      return;
    }

    const nextOffset = clamp((scrollX / maxScrollDistance) * maxTrackOffset, 0, maxTrackOffset);
    setIndicatorOffset(nextOffset);
  }

  function handleTrackLayout(e: { nativeEvent: { layout: { width: number } } }) {
    trackWidthRef.current = e.nativeEvent.layout.width || TRACK_WIDTH;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
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

      <View style={styles.indicatorTrack} onLayout={handleTrackLayout}>
        <View
          style={[
            styles.indicatorBar,
            { left: indicatorOffset },
          ]}
          pointerEvents="none"
        />
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
    width: TRACK_WIDTH,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.track,
    alignSelf: 'center',
    marginTop: spacing.md,
    overflow: 'hidden',
    position: 'relative',
  },
  indicatorBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: INDICATOR_WIDTH,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.indicator,
  },
});
