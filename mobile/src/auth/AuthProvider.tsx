import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Arena } from '@/api/types';
import { config } from '@/config';

export type AuthUser = {
  id: string;
  arena: Arena;
  name?: string;
  role?: string;
};

// Until the Miraj login lands: the fixed development user (same id the mock API acts as).
const BYPASS_USER: AuthUser = { id: config.mockUser, arena: 'IL' };

type AuthContextValue = {
  isSignedIn: boolean;
  user: AuthUser | null;
  getAccessToken: () => Promise<string | null>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [isSignedIn, setIsSignedIn] = useState(config.authBypass);

  const value = useMemo<AuthContextValue>(
    () => ({
      isSignedIn,
      user: isSignedIn ? BYPASS_USER : null,
      getAccessToken: async () => null,
      signIn: async () => setIsSignedIn(true),
      signOut: async () => setIsSignedIn(false),
    }),
    [isSignedIn],
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
