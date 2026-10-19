// Rubik, only the weights and scripts Figma uses (Hebrew UI, Latin wordmark).
import '@fontsource/rubik/hebrew-300.css';
import '@fontsource/rubik/hebrew-600.css';
import '@fontsource/rubik/hebrew-700.css';
import '@fontsource/rubik/latin-300.css';
import '@fontsource/rubik/latin-600.css';
import '@fontsource/rubik/latin-700.css';
import '@/styles/global.css';

import { StrictMode } from 'react';
import { router } from '@/app/router';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { MuiThemeProvider } from '@/app/MuiThemeProvider';
import { queryClient } from '@/config/react-query.config';
import { QueryClientProvider } from '@tanstack/react-query';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found in index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MuiThemeProvider>
        <RouterProvider router={router} />
      </MuiThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
