import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';

interface RenderWithRouterOptions {
  /** URL the component is rendered at. Defaults to "/". */
  route?: string;
}

/** Renders `ui` inside an in-memory router, for components that use links or route hooks. */
export const renderWithRouter = (
  ui: ReactElement,
  { route = '/' }: RenderWithRouterOptions = {},
) => {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
};
