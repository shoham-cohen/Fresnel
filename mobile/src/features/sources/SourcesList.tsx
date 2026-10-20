import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Loading } from '@/components/Loading';
import { SearchInput } from '@/components/SearchInput';
import { colors, fontSize, spacing, textAlignStart } from '@/theme';

import { SourceRow } from './SourceRow';
import { useSources } from './useSources';

type Props = {
  eventId: string;
};

export function SourcesList({ eventId }: Props) {
  const sources = useSources(eventId);
  const { items, total, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = sources;
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const query = search.trim().toLowerCase();

  // The search runs on the items already loaded (the Data Lake has no text search).
  const visibleItems = useMemo(() => {
    if (!query) return items;
    return items.filter((item) =>
      [item.authorName, item.sourceId, item.title, item.contentText].some((field) =>
        field?.toLowerCase().includes(query),
      ),
    );
  }, [items, query]);

  // Pull-to-refresh only. The 60-second polling refetches without showing the spinner.
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
    <FlatList
      data={visibleItems}
      keyExtractor={(item) => item.itemId}
      renderItem={({ item }) => <SourceRow item={item} />}
      keyboardShouldPersistTaps="handled"
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>
            מקורות מידע {sources.data ? <Text style={styles.count}>({total})</Text> : null}
          </Text>
          <SearchInput value={search} onChangeText={setSearch} />
        </View>
      }
      ListEmptyComponent={
        sources.isPending ? (
          <Loading />
        ) : sources.isError ? (
          <ErrorState message="לא הצלחנו לטעון את המקורות" onRetry={() => refetch()} />
        ) : (
          <EmptyState text={query ? 'לא נמצאו מקורות' : 'אין מקורות לאירוע'} />
        )
      }
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator style={styles.footer} color={colors.text} />
        ) : query && hasNextPage ? (
          <Text style={[styles.footer, styles.footerText]}>
            חיפוש ב-{items.length} מתוך {total}
          </Text>
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
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
  footer: {
    padding: spacing.lg,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
