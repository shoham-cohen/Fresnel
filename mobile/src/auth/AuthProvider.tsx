import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { apiFetch, setAccessToken, setUnauthorizedHandler } from '@/api/client';
import { queryClient } from '@/api/queryClient';
import type { Arena } from '@/api/types';

export type AuthUser = {
  id: string;
  name: string;
  arenas: Arena[];
  roles: string[];
};

// POST /api/mobile/auth. Until the Miraj login lands, the server hands out a token for a random
// mock user, and the mock filters every call by that user's arenas.
type Session = {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
};

type AuthContextValue = {
  isSignedIn: boolean;
  isSigningIn: boolean;
  signInError: unknown;
  user: AuthUser | null;
  getAccessToken: () => Promise<string | null>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type Props = {
  children: ReactNode;
};

// The session lives in memory only, so every launch starts at the login screen.
export function AuthProvider({ children }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<unknown>(null);
  // The last signed-in user, so the next sign-in picks someone else.
  const lastUserId = useRef<string | null>(null);

  const signOut = useCallback(async () => {
    setAccessToken(null);
    setSession(null);
    // The next user must not see the previous user's events, even for a moment.
    queryClient.clear();
  }, []);

  const signIn = useCallback(async () => {
    setIsSigningIn(true);
    setSignInError(null);
    try {
      const params = lastUserId.current
        ? `?${new URLSearchParams({ exclude: lastUserId.current })}`
        : '';
      const next = await apiFetch<Session>(`/api/mobile/auth${params}`, { method: 'POST' });
      lastUserId.current = next.user.id;
      queryClient.clear();
      setAccessToken(next.accessToken);
      setSession(next);
    } catch (error) {
      setSignInError(error);
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => void signOut());
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isSignedIn: session !== null,
      isSigningIn,
      signInError,
      user: session?.user ?? null,
      getAccessToken: async () => session?.accessToken ?? null,
      signIn,
      signOut,
    }),
    [session, isSigningIn, signInError, signIn, signOut],
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
