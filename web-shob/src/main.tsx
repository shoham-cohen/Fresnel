import '@fontsource/rubik/hebrew-300.css';
import '@fontsource/rubik/hebrew-600.css';
import '@fontsource/rubik/hebrew-700.css';
import '@fontsource/rubik/latin-300.css';
import '@fontsource/rubik/latin-600.css';
import '@fontsource/rubik/latin-700.css';
import '@/styles/global.css';

import { StrictMode } from 'react';
import { initAuth } from '@/auth/keycloak';
import { router } from '@/app/router';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { RealityProvider } from '@/contexts';
import { RtlCacheProvider } from '@/app/RtlCacheProvider';
import { queryClient } from '@/config/react-query.config';
import { QueryClientProvider } from '@tanstack/react-query';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

// Before rendering, not in a useEffect: nothing renders until the user is signed in.
await initAuth();

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RtlCacheProvider>
        <RealityProvider>
          <RouterProvider router={router} />
        </RealityProvider>
      </RtlCacheProvider>
    </QueryClientProvider>
  </StrictMode>,
);
