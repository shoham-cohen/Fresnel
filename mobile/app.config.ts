/// <reference types="node" />
import { existsSync } from 'node:fs';

import type { ExpoConfig } from 'expo/config';

// App identifiers. Shared by the whole team, not secrets.
// The Android package must match the app registered in Firebase (google-services.json).
const ANDROID_PACKAGE = 'com.fresnel.mobile';
const IOS_BUNDLE_ID = 'com.fresnel.mobile';
// From `eas init`. Needed for Expo push tokens. Not a secret.
const EAS_PROJECT_ID = '7f7941cb-550f-4dd2-a39b-826ea3a35ddf';


// google-services.json from Firebase, committed next to this file.
const googleServicesFile = existsSync('./google-services.json')
  ? './google-services.json'
  : undefined;

const config: ExpoConfig = {
  name: 'Fresnel',
  slug: 'fresnel-mobile',
  owner: 'bennat676s-team',
  scheme: 'fresnel',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  icon: './assets/icon.png',
  web: {
    favicon: './assets/favicon.png',
  },
  ios: {
    bundleIdentifier: IOS_BUNDLE_ID,
    supportsTablet: false,
  },
  android: {
    package: ANDROID_PACKAGE,
    googleServicesFile,
    // The foreground is the logo shrunk into the launcher's safe zone; the background is its navy.
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#0E1A2B',
    },
    predictiveBackGestureEnabled: false,
  },
  plugins: [
    'expo-router',
    'expo-dev-client',
    'expo-status-bar',
    'expo-web-browser',
    'expo-secure-store',
    'expo-notifications',
    ['expo-localization', { supportsRTL: true, forcesRTL: true }],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: EAS_PROJECT_ID || undefined,
    },
  },
};

export default config;
