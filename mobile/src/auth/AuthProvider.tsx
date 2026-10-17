import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { config } from '@/config';

type AuthContextValue = {
  isSignedIn: boolean;
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
