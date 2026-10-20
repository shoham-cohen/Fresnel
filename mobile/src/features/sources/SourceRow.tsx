import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import type { SourceItem } from '@/api/types';
import { colors, fontSize, radius, spacing, textAlignStart } from '@/theme';
import { formatTime } from '@/utils/formatTime';

type IconName = ComponentProps<typeof Ionicons>['name'];

const PLATFORM_ICON: Record<string, IconName> = {
  telegram: 'paper-plane-outline',
  x: 'logo-twitter',
  twitter: 'logo-twitter',
  facebook: 'logo-facebook',
  instagram: 'logo-instagram',
  tiktok: 'logo-tiktok',
  youtube: 'logo-youtube',
  news: 'newspaper-outline',
};

type Props = {
  item: SourceItem;
};

export function SourceRow({ item }: Props) {
  const { url } = item;
  const author = item.authorName || item.sourceId || '—';
  const text = item.title || item.contentText || '—';

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={url ? () => Linking.openURL(url) : undefined}
      disabled={!url}
      accessibilityRole="link"
    >
      <View style={styles.icon}>
        <Ionicons
          name={PLATFORM_ICON[item.platform] ?? 'globe-outline'}
          size={18}
          color={colors.textMuted}
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.author} numberOfLines={1}>
          {author}
        </Text>
        <Text style={styles.text} numberOfLines={2}>
          {text}
        </Text>
      </View>
      <Text style={styles.time}>{formatTime(item.publishedAt)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  pressed: {
    backgroundColor: colors.surface,
  },
  icon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.iconBackground,
  },
  body: {
    flex: 1,
  },
  author: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text,
    textAlign: textAlignStart,
  },
  text: {
    fontSize: fontSize.sm,
    color: colors.text,
    textAlign: textAlignStart,
  },
  time: {
    fontSize: fontSize.sm,
    color: colors.text,
  },
});
