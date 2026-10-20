import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, fontSize, radius, spacing, textAlignStart } from '@/theme';

import { SourceRow } from './SourceRow';
import type { SourceItem } from './types';

type Props = {
  items: SourceItem[];
  total: number;
};

export function SourcesList({ items, total }: Props) {
  const [search, setSearch] = useState('');
  const query = search.trim().toLowerCase();

  // The search runs on the items already loaded (Nexus has no text search).
  const visibleItems = useMemo(() => {
    if (!query) return items;
    return items.filter((item) =>
      [item.authorName, item.sourceId, item.title, item.contentText].some((field) =>
        field?.toLowerCase().includes(query),
      ),
    );
  }, [items, query]);

  const hasMore = items.length < total;

  return (
    <FlatList
      data={visibleItems}
      keyExtractor={(item) => item.itemId}
      renderItem={({ item }) => <SourceRow item={item} />}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>
            מקורות מידע <Text style={styles.count}>({total})</Text>
          </Text>
          <View style={styles.search}>
            <Ionicons name="search" size={18} color={colors.text} />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="חפש.."
              placeholderTextColor={colors.textMuted}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
        </View>
      }
      ListEmptyComponent={<Text style={styles.footer}>לא נמצאו מקורות</Text>}
      ListFooterComponent={
        query && hasMore ? (
          <Text style={styles.footer}>
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
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    backgroundColor: colors.input,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
    textAlign: textAlignStart,
  },
  footer: {
    padding: spacing.lg,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
