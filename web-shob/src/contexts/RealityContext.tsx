import { createContext, useMemo, useState, type ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

import { getTheme } from '@/styles/theme';
import type { Reality } from '@/types';

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
  const [reality, setReality] = useState<Reality>(initialReality);

  const theme = useMemo(() => getTheme(reality), [reality]);

  return (
    <RealityContext.Provider value={{ reality, setReality, theme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </RealityContext.Provider>
  );
}