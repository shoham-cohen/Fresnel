import Constants from 'expo-constants';
import { Platform } from 'react-native';

// The phone always goes through our api/ (port 3000), never to the mock server directly.
const DEFAULT_API_URL = 'http://localhost:3000';

// On Android, localhost is the emulator or the phone itself, not the computer running api/.
// In development api/ runs next to Metro, so a localhost URL is pointed at Metro's host
// (the computer's LAN address), or at 10.0.2.2 (the computer, seen from the emulator).
function resolveApiUrl(url: string) {
  if (Platform.OS !== 'android') return url;
  const match = /^(https?:\/\/)(?:localhost|127\.0\.0\.1)(.*)$/.exec(url);
  if (!match) return url;
  const metroHost = Constants.expoConfig?.hostUri?.split(':')[0];
  const host =
    metroHost && !['localhost', '127.0.0.1'].includes(metroHost) ? metroHost : '10.0.2.2';
  return `${match[1]}${host}${match[2]}`;
}

// EXPO_PUBLIC_* values are bundled into the app. Never put secrets here.
export const config = {
  apiUrl: resolveApiUrl(process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL),
  socketUrl: process.env.EXPO_PUBLIC_SOCKET_URL ?? '',
  keycloakIssuer: process.env.EXPO_PUBLIC_KEYCLOAK_ISSUER ?? '',
  keycloakClientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID ?? '',
  oracleUrl: process.env.EXPO_PUBLIC_ORACLE_URL ?? '',
  authBypass: process.env.EXPO_PUBLIC_AUTH_BYPASS === 'true',
  // Development only: the mock API reads the signed-in user from the X-Mock-User header.
  mockUser: process.env.EXPO_PUBLIC_MOCK_USER ?? '',
};
