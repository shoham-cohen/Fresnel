import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { useReality } from '@/hooks';
import { paths } from '@/routes/paths';
import { renderWithRouter } from '@/test/renderWithRouter';

import { Navbar } from './Navbar';

describe('Navbar', () => {
  it('renders the wordmark and a link for every nav item', () => {
    renderWithRouter(<Navbar />);

    expect(screen.getByText('Palantir')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'מסך ראשי' })).toHaveAttribute('href', paths.home);
    expect(screen.getByRole('link', { name: 'היסטוריית התראות' })).toHaveAttribute(
      'href',
      paths.narrativeHistory,
    );
  });

  it('marks only the link for the current route as active', () => {
    renderWithRouter(<Navbar />, { route: paths.narrativeHistory });

    expect(screen.getByRole('link', { name: 'היסטוריית התראות' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'מסך ראשי' })).not.toHaveAttribute('aria-current');
  });

  it('switches the reality toggle when an option is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Navbar />);

    const real = screen.getByRole('radio', { name: 'אמת' });
    const exercise = screen.getByRole('radio', { name: 'תרגילית' });
    expect(real).toBeChecked();

    await user.click(exercise);

    expect(exercise).toBeChecked();
    expect(real).not.toBeChecked();
  });

  it('updates the context reality and theme when an option is clicked', async () => {
    function ThemeChecker() {
      const { reality, theme } = useReality();
      return (
        <div>
          <span data-testid="reality-value">{reality}</span>
          <span data-testid="theme-header-bg">{theme.palette.header.background}</span>
        </div>
      );
    }

    const user = userEvent.setup();
    renderWithRouter(
      <>
        <Navbar />
        <ThemeChecker />
      </>,
    );

    const exerciseRadio = screen.getByRole('radio', { name: 'תרגילית' });

    expect(screen.getByTestId('reality-value')).toHaveTextContent('real');
    expect(screen.getByTestId('theme-header-bg')).toHaveTextContent('#102B4D');

    await user.click(exerciseRadio);

    expect(screen.getByTestId('reality-value')).toHaveTextContent('exercise');
    expect(screen.getByTestId('theme-header-bg')).toHaveTextContent('#49311F');
  });

  it('shows a placeholder user name when none is passed in', () => {
    renderWithRouter(<Navbar />);

    expect(screen.getByText('שם משתמש')).toBeInTheDocument();
  });

  it('shows the user name that is passed in', () => {
    renderWithRouter(<Navbar userName="ישראל ישראלי" />);

    expect(screen.getByText('ישראל ישראלי')).toBeInTheDocument();
  });
});
