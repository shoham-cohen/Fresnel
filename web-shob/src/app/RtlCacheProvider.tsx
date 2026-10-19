import type { FC, ReactNode } from 'react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';

// The theme is direction: 'rtl'; this cache mirrors MUI's left / right styles to match.
const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});

interface RtlCacheProviderProps {
  children: ReactNode;
}

export const RtlCacheProvider: FC<RtlCacheProviderProps> = ({ children }) => {
  return <CacheProvider value={rtlCache}>{children}</CacheProvider>;
};
