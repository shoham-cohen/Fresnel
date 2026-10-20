import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable } from 'react-native';
import { SCREEN_TITLE } from '@/constants/labels';
import { colors } from '@/theme';

export default function AppLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.header },
          headerTintColor: colors.onHeader,
          headerTitleStyle: { fontWeight: '700' },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: SCREEN_TITLE.home,
            headerRight: () => (
              <Link href="/profile" asChild>
                <Pressable hitSlop={12} accessibilityRole="button" accessibilityLabel="פרופיל">
                  <Ionicons name="person-circle-outline" size={28} color={colors.onHeader} />
                </Pressable>
              </Link>
            ),
          }}
        />
        <Stack.Screen name="profile" options={{ title: SCREEN_TITLE.profile }} />
        <Stack.Screen name="events/[id]" options={{ title: SCREEN_TITLE.event }} />
      </Stack>
    </>
  );
}
