import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';

import { theme } from '@/theme';

interface RenderWithRouterOptions {
  /** URL the component is rendered at. Defaults to "/". */
  route?: string;
}

/** Renders `ui` inside an in-memory router, for components that use links or route hooks. */
export function renderWithRouter(ui: ReactElement, { route = '/' }: RenderWithRouterOptions = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </ThemeProvider>,
  );
}
