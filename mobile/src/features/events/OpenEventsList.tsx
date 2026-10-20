import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SearchInput } from '@/components/SearchInput';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { colors, fontSize, radius, spacing, textAlignStart } from '@/theme';

import { EventRow } from './EventRow';
import { useOpenEvents } from './useOpenEvents';

const SEARCH_DEBOUNCE_MS = 400;

export function OpenEventsList() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);
  const openEvents = useOpenEvents(debouncedSearch);
  const { events, total, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = openEvents;
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pull-to-refresh only. The 15-second polling refetches without showing the spinner.
  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const onEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  return (
    <View style={styles.card}>
      <FlatList
        data={events}
        keyExtractor={(event) => event.eventId}
        renderItem={({ item }) => <EventRow event={item} />}
        keyboardShouldPersistTaps="handled"
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>
              אירועים פתוחים{' '}
              {openEvents.data ? <Text style={styles.count}>({total})</Text> : null}
            </Text>
            <SearchInput value={search} onChangeText={setSearch} />
          </View>
        }
        ListEmptyComponent={
          openEvents.isPending ? (
            <ActivityIndicator style={styles.state} color={colors.text} />
          ) : openEvents.isError ? (
            <View style={styles.state}>
              <Text style={styles.stateText}>לא הצלחנו לטעון את האירועים</Text>
              <Pressable style={styles.retry} onPress={() => refetch()} accessibilityRole="button">
                <Text style={styles.retryLabel}>נסה שוב</Text>
              </Pressable>
            </View>
          ) : (
            <Text style={[styles.state, styles.stateText]}>
              {debouncedSearch ? 'לא נמצאו אירועים' : 'אין אירועים פתוחים בגזרה'}
            </Text>
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.state} color={colors.text} />
          ) : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: spacing.md,
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: colors.card,
    boxShadow: `0 1px 4px ${colors.cardShadow}`,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.text,
    textAlign: textAlignStart,
  },
  count: {
    fontSize: fontSize.md,
  },
  state: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  stateText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  retry: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.header,
  },
  retryLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.onHeader,
  },
});
