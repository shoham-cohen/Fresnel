import type { ReactNode } from 'react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';

import { theme } from './theme';

// Mirrors MUI's left / right styles for the RTL layout.
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});

interface MuiThemeProviderProps {
  children: ReactNode;
}

export const MuiThemeProvider = ({ children }: MuiThemeProviderProps) => {
  return (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
};
