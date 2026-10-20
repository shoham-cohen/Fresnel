import type { Reality } from '@/types';
import { getTheme } from '@/styles/theme';
import type { Theme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import { REALITY_STORAGE_KEY } from '@/features/narratives/constants';
import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const isReality = (value: unknown): value is Reality => value === 'real' || value === 'exercise';

const readStoredReality = (fallback: Reality): Reality => {
  try {
    const stored = localStorage.getItem(REALITY_STORAGE_KEY);
    return isReality(stored) ? stored : fallback;
  } catch {
    return fallback;
  }
};

const storeReality = (reality: Reality) => {
  try {
    localStorage.setItem(REALITY_STORAGE_KEY, reality);
  } catch {}
};

export type RealityContextType = {
  reality: Reality;
  setReality: (reality: Reality) => void;
  theme: Theme;
};

export interface RealityProviderProps {
  children: ReactNode;
  initialReality?: Reality;
}

export const RealityContext = createContext<RealityContextType | undefined>(undefined);

export function RealityProvider({ children, initialReality = 'real' }: RealityProviderProps) {
  const [reality, setReality] = useState<Reality>(() => readStoredReality(initialReality));

  useEffect(() => {
    storeReality(reality);
  }, [reality]);

  const theme = useMemo(() => getTheme(reality), [reality]);

  return (
    <RealityContext.Provider value={{ reality, setReality, theme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </RealityContext.Provider>
  );
}