import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { AndroidImportance, IosAuthorizationStatus } from 'expo-notifications';
import { Platform } from 'react-native';

import { apiFetch } from '@/api/client';

import { setPushStatus } from './pushStatus';

// A Push that arrives while the app is open is shown too. On Android, shouldPlaySound: false would
// hide the banner; the channel decides the actual sound.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// The server picks the channel by is_anomaly (channelId in the Push).
export const ANDROID_CHANNEL = {
  anomaly: 'anomaly',
  narrative: 'narrative',
} as const;

// The token this phone registered, so sign-out can remove it.
let registeredToken: string | null = null;

async function ensureAndroidChannels() {
  if (Platform.OS !== 'android') return;
  // Channels must exist before the permission prompt (Android 13+).
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL.anomaly, {
    name: 'אנומליה',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL.narrative, {
    name: 'אירוע',
    importance: AndroidImportance.DEFAULT,
    sound: null,
  });
}

async function hasPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.ios?.status === IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }
  if (!current.canAskAgain) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted || requested.ios?.status === IosAuthorizationStatus.PROVISIONAL;
}

/**
 * MAR-18: permission → Expo push token → POST /api/devices. The server takes the user and the
 * arenas from the access token. Safe to call again (upsert on the token).
 */
export async function registerPushDevice(): Promise<void> {
  if (Platform.OS === 'web') {
    setPushStatus('unsupported');
    return;
  }

  await ensureAndroidChannels();
  if (!(await hasPermission())) {
    setPushStatus('denied');
    return;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) {
    throw new Error('EAS projectId is missing (app.config.ts)');
  }
  const { data: pushToken } = await Notifications.getExpoPushTokenAsync({ projectId });

  await apiFetch<void>('/api/devices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ platform: Platform.OS, pushToken }),
  });
  registeredToken = pushToken;
  setPushStatus('registered');
}

/**
 * Sign-out: the phone stops getting this user's Push. Never throws, so sign-out always completes.
 */
export async function unregisterPushDevice(): Promise<void> {
  const token = registeredToken;
  registeredToken = null;
  setPushStatus('idle');
  if (!token) return;
  try {
    await apiFetch<void>(`/api/devices/${encodeURIComponent(token)}`, { method: 'DELETE' });
  } catch {
    // The row stays until the next user registers this phone (the upsert moves it to them),
    // or Expo reports the token dead. Nothing to show: the user is signing out.
    setPushStatus('idle');
  }
}
