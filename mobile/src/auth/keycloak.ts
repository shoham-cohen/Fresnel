import {
  AuthRequest,
  exchangeCodeAsync,
  fetchDiscoveryAsync,
  makeRedirectUri,
  refreshAsync,
  type DiscoveryDocument,
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { config } from '@/config';

// Closes the login popup on web. No-op on Android and iOS.
WebBrowser.maybeCompleteAuthSession();

// fresnel://oauth on the phone (scheme in app.config.ts). Must be registered on the Keycloak client.
export const redirectUri = makeRedirectUri({ scheme: 'fresnel', path: 'oauth' });

const SCOPES = ['openid', 'profile'];

export type KeycloakTokens = {
  accessToken: string;
  refreshToken: string | null;
  /** epoch ms */
  expiresAt: number;
};

let discoveryPromise: Promise<DiscoveryDocument> | null = null;

function discovery(): Promise<DiscoveryDocument> {
  if (!config.keycloakIssuer || !config.keycloakClientId) {
    throw new Error('EXPO_PUBLIC_KEYCLOAK_ISSUER and EXPO_PUBLIC_KEYCLOAK_CLIENT_ID must be set');
  }
  discoveryPromise ??= fetchDiscoveryAsync(config.keycloakIssuer).catch((error: unknown) => {
    // Try again next time (openport may have been down).
    discoveryPromise = null;
    throw error;
  });
  return discoveryPromise;
}

function toTokens(response: { accessToken: string; refreshToken?: string; expiresIn?: number; issuedAt: number }) {
  // Keycloak always sends expires_in (5 minutes). Fall back to 60 seconds so we refresh early, not late.
  const expiresIn = response.expiresIn ?? 60;
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken ?? null,
    expiresAt: (response.issuedAt + expiresIn) * 1000,
  };
}

/**
 * Authorization Code + PKCE in the system browser. Returns null when the user closes the browser.
 */
export async function signInWithKeycloak(): Promise<KeycloakTokens | null> {
  const doc = await discovery();
  const request = new AuthRequest({
    clientId: config.keycloakClientId,
    redirectUri,
    scopes: SCOPES,
    usePKCE: true,
  });

  const result = await request.promptAsync(doc);
  if (result.type === 'cancel' || result.type === 'dismiss') {
    return null;
  }
  if (result.type !== 'success') {
    throw new Error(result.type === 'error' ? (result.error?.message ?? 'login failed') : `login ${result.type}`);
  }

  const response = await exchangeCodeAsync(
    {
      clientId: config.keycloakClientId,
      code: result.params.code,
      redirectUri,
      extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
    },
    doc,
  );
  return toTokens(response);
}

export async function refreshKeycloakTokens(refreshToken: string): Promise<KeycloakTokens> {
  const doc = await discovery();
  const response = await refreshAsync({ clientId: config.keycloakClientId, refreshToken }, doc);
  // Keycloak may rotate the refresh token. Keep the old one if it did not send a new one.
  const tokens = toTokens(response);
  return { ...tokens, refreshToken: tokens.refreshToken ?? refreshToken };
}

/**
 * Ends the Keycloak session (and so the browser's SSO cookie) without opening the browser.
 * A public client may log out with its refresh token.
 */
export async function endKeycloakSession(refreshToken: string): Promise<void> {
  const doc = await discovery();
  if (!doc.endSessionEndpoint) {
    return;
  }
  const body = new URLSearchParams({ client_id: config.keycloakClientId, refresh_token: refreshToken });
  await fetch(doc.endSessionEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
}
