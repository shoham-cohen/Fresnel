import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Only the refresh token is stored (Keychain / Keystore). The access token lives in memory: it
// expires in 5 minutes, and both together could pass the 2KB SecureStore limit on Android.
const REFRESH_TOKEN_KEY = 'fresnel.refreshToken';

// expo-secure-store has no web implementation. On web (development only) nothing is kept.
const isSupported = Platform.OS !== 'web';

export async function loadRefreshToken(): Promise<string | null> {
  if (!isSupported) return null;
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function saveRefreshToken(refreshToken: string | null): Promise<void> {
  if (!isSupported) return;
  if (refreshToken) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
}
