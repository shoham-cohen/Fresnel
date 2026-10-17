/// <reference types="node" />
import { existsSync } from 'node:fs';

import type { ExpoConfig } from 'expo/config';

// App identifiers. Shared by the whole team, not secrets.
// The Android package must match the app registered in Firebase (google-services.json).
const ANDROID_PACKAGE = 'com.fresnel.mobile';
const IOS_BUNDLE_ID = 'com.fresnel.mobile';

// From `eas init`. Needed for Expo push tokens. Not a secret.
const EAS_PROJECT_ID = '';

// google-services.json from Firebase, committed next to this file.
const googleServicesFile = existsSync('./google-services.json')
  ? './google-services.json'
  : undefined;

const config: ExpoConfig = {
  name: 'Fresnel',
  slug: 'fresnel-mobile',
  scheme: 'fresnel',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  ios: {
    bundleIdentifier: IOS_BUNDLE_ID,
    supportsTablet: false,
  },
  android: {
    package: ANDROID_PACKAGE,
    googleServicesFile,
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
