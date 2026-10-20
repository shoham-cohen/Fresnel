import { TokenError } from 'expo-auth-session';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { configureApiAuth } from '@/api/client';
import { queryClient } from '@/api/queryClient';
import { config } from '@/config';
import { unregisterPushDevice } from '@/notifications/registerPush';

import { userFromAccessToken, type AuthUser } from './claims';
import { endKeycloakSession, refreshKeycloakTokens, signInWithKeycloak, type KeycloakTokens } from './keycloak';
import { loadRefreshToken, saveRefreshToken } from './sessionStore';

export type { Arena, AuthUser } from './claims';

type AuthStatus = 'restoring' | 'signedOut' | 'signedIn';

type AuthContextValue = {
  status: AuthStatus;
  isSignedIn: boolean;
  user: AuthUser | null;
  /** Opens Keycloak in the system browser. Resolves false when the user closed it. */
  signIn: () => Promise<boolean>;
  signOut: () => Promise<void>;
  /** A valid access token, refreshed when under 30 seconds are left. null in AUTH_BYPASS. */
  getAccessToken: () => Promise<string | null>;
};

// The fixed user of EXPO_PUBLIC_AUTH_BYPASS=true. Same id as DEV_USER on the server (MOBILE_AUTH_BYPASS).
export const DEV_USER: AuthUser = {
  id: 'dev-mobile-user',
  username: 'dev.mobile',
  name: 'משתמש פיתוח',
  arenas: ['israel', 'arab', 'intl'],
  roles: [],
};

const REFRESH_MARGIN_MS = 30_000;

const AuthContext = createContext<AuthContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [status, setStatus] = useState<AuthStatus>(config.authBypass ? 'signedIn' : 'restoring');
  const [user, setUser] = useState<AuthUser | null>(config.authBypass ? DEV_USER : null);
  const tokens = useRef<KeycloakTokens | null>(null);
  const refreshing = useRef<Promise<KeycloakTokens> | null>(null);

  const applyTokens = useCallback(async (next: KeycloakTokens) => {
    tokens.current = next;
    await saveRefreshToken(next.refreshToken);
    setUser(userFromAccessToken(next.accessToken, config.keycloakClientId));
    setStatus('signedIn');
  }, []);

  const clearSession = useCallback(async () => {
    tokens.current = null;
    refreshing.current = null;
    await saveRefreshToken(null);
    queryClient.clear();
    setUser(null);
    setStatus('signedOut');
  }, []);

  // One refresh at a time, however many requests ask for a token together.
  const refresh = useCallback(async (): Promise<KeycloakTokens> => {
    const refreshToken = tokens.current?.refreshToken;
    if (!refreshToken) {
      throw new Error('no refresh token');
    }
    refreshing.current ??= refreshKeycloakTokens(refreshToken)
      .then(async (next) => {
        await applyTokens(next);
        return next;
      })
      .finally(() => {
        refreshing.current = null;
      });
    return refreshing.current;
  }, [applyTokens]);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (config.authBypass) return null;
    const current = tokens.current;
    if (!current) return null;
    if (current.expiresAt - Date.now() > REFRESH_MARGIN_MS) {
      return current.accessToken;
    }
    try {
      return (await refresh()).accessToken;
    } catch (error) {
      // The Keycloak session ended (expired, revoked, logged out elsewhere): back to login.
      if (error instanceof TokenError) {
        await clearSession();
        return null;
      }
      throw error;
    }
  }, [refresh, clearSession]);

  const signIn = useCallback(async () => {
    const next = await signInWithKeycloak();
    if (!next) return false;
    await applyTokens(next);
    return true;
  }, [applyTokens]);

  const signOut = useCallback(async () => {
    if (config.authBypass) return;
    const refreshToken = tokens.current?.refreshToken;
    try {
      // While the access token is still valid: the phone stops getting this user's Push.
      await unregisterPushDevice();
      if (refreshToken) {
        await endKeycloakSession(refreshToken);
      }
    } finally {
      // Signed out on the phone even if the network calls failed.
      await clearSession();
    }
  }, [clearSession]);

  // Restore the session after the app restarts: refresh token from SecureStore → new access token.
  useEffect(() => {
    if (config.authBypass) return;
    let cancelled = false;

    async function restore() {
      const refreshToken = await loadRefreshToken();
      if (!refreshToken) {
        setStatus('signedOut');
        return;
      }
      try {
        const next = await refreshKeycloakTokens(refreshToken);
        if (!cancelled) await applyTokens(next);
      } catch (error) {
        if (cancelled) return;
        if (error instanceof TokenError) {
          // The stored session is no longer valid.
          await saveRefreshToken(null);
        }
        // Keycloak unreachable: keep the stored token and show login, so a retry can work.
        setStatus('signedOut');
      }
    }

    void restore();
    return () => {
      cancelled = true;
    };
  }, [applyTokens]);

  // apiFetch asks here for the token, and reports a 401.
  useEffect(() => {
    configureApiAuth({ getAccessToken, onUnauthorized: clearSession });
  }, [getAccessToken, clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({ status, isSignedIn: status === 'signedIn', user, signIn, signOut, getAccessToken }),
    [status, user, signIn, signOut, getAccessToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return value;
}
