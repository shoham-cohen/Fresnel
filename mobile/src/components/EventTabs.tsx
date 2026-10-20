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
    marginBottom: spacing.md,
    padding: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: '#DCE8F5',
  },
  tab: {
    flex: 1,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  activeTab: {
    backgroundColor: colors.background,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: fontSize.sm,
    color: '#556A82',
    fontWeight: '500',
  },
  activeLabel: {
    color: colors.navy,
    fontWeight: '700',
  },
});
