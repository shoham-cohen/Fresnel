import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
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
            <Loading />
          ) : openEvents.isError ? (
            <ErrorState message="לא הצלחנו לטעון את האירועים" onRetry={() => refetch()} />
          ) : (
            <EmptyState text={debouncedSearch ? 'לא נמצאו אירועים' : 'אין אירועים פתוחים בגזרה'} />
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={styles.nextPage} color={colors.text} />
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
    backgroundColor: colors.cardBackground,
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
  nextPage: {
    padding: spacing.lg,
  },
});
