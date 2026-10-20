import { router, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EVENT_TAB_LABEL } from '@/constants/labels';
import { colors, fontSize, radius, spacing } from '@/theme';

const TABS = [
  { key: 'snapshot', route: '/events/[id]', suffix: '' },
  { key: 'actions', route: '/events/[id]/actions', suffix: '/actions' },
  { key: 'sources', route: '/events/[id]/sources', suffix: '/sources' },
] as const;

type Props = {
  eventId: string;
};

export function EventTabs({ eventId }: Props) {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {TABS.map((tab) => {
        const isActive = pathname === `/events/${eventId}${tab.suffix}`;
        return (
          <Pressable
            key={tab.key}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => router.replace({ pathname: tab.route, params: { id: eventId } })}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {EVENT_TAB_LABEL[tab.key]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    padding: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  tab: {
    flex: 1,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  activeTab: {
    borderWidth: 1,
    borderColor: colors.activeTabBorder,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  activeLabel: {
    color: colors.text,
    fontWeight: '600',
  },
});
