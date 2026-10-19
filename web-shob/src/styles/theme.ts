import { createTheme, type Theme } from '@mui/material/styles';

import type { Reality } from '@/types';

declare module '@mui/material/styles' {
  interface Palette {
    reality: Reality;
    header: {
      background: string;
      text: string;
    };
    toggle: {
      track: string;
      thumb: string;
    };
    accent: {
      main: string;
      light: string;
    };
  }
  interface PaletteOptions {
    reality?: Reality;
    header?: {
      background?: string;
      text?: string;
    };
    toggle?: {
      track?: string;
      thumb?: string;
    };
    accent?: {
      main?: string;
      light?: string;
    };
  }
  interface Theme {
    customSizes: {
      headerHeight: number;
    };
  }
  interface ThemeOptions {
    customSizes?: {
      headerHeight?: number;
    };
  }
}

export const REAL_PALETTE = {
  reality: 'real' as const,
  primary: '#4872A5', // Blue accent / progress filled
  background: '#ffffff',
  headerBg: '#102B4D', // Dark navy header
  headerText: '#ffffff',
  toggleTrack: '#02152B', // Deep navy track
  toggleThumb: '#4872A5', // Active toggle thumb blue
  accentLight: '#E8F1FC', // Soft ice blue (table headers, progress track)
  textPrimary: '#000000',
  textSecondary: '#666666',
};

/**
 * Color palette specifications for "Exercise" (תרגילית) mode.
 */
export const EXERCISE_PALETTE = {
  reality: 'exercise' as const,
  primary: '#B99462', // Warm tan / bronze accent
  background: '#ffffff',
  headerBg: '#49311F', // Dark warm brown header
  headerText: '#ffffff',
  toggleTrack: '#684B31', // Brown track
  toggleThumb: '#B99462', // Active toggle thumb tan
  accentLight: '#EDE2D3', // Soft warm beige (table headers, progress track)
  textPrimary: '#000000',
  textSecondary: '#666666',
};

export interface RealityPaletteConfig {
  reality: Reality;
  primary: string;
  background: string;
  headerBg: string;
  headerText: string;
  toggleTrack: string;
  toggleThumb: string;
  accentLight: string;
  textPrimary: string;
  textSecondary: string;
}

function createRealityTheme(config: RealityPaletteConfig): Theme {
  return createTheme({
    direction: 'rtl',
    typography: {
      fontFamily: "'Rubik', sans-serif",
      fontSize: 16,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
    },
    palette: {
      reality: config.reality,
      background: {
        default: config.background,
        paper: config.background,
      },
      text: {
        primary: config.textPrimary,
        secondary: config.textSecondary,
      },
      primary: {
        main: config.primary,
        light: config.accentLight,
      },
      secondary: {
        main: config.toggleThumb,
      },
      header: {
        background: config.headerBg,
        text: config.headerText,
      },
      toggle: {
        track: config.toggleTrack,
        thumb: config.toggleThumb,
      },
      accent: {
        main: config.primary,
        light: config.accentLight,
      },
    },
    shape: {
      borderRadius: 5,
    },
    customSizes: {
      headerHeight: 79,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: config.headerBg,
            color: config.headerText,
            boxShadow: 'none',
          },
        },
      },
      MuiButtonBase: {
        defaultProps: {
          disableRipple: false,
        },
      },
    },
  });
}

/** Theme for "Real" (אמת) mode */
export const realTheme = createRealityTheme(REAL_PALETTE);

/** Theme for "Exercise" (תרגילית) mode */
export const exerciseTheme = createRealityTheme(EXERCISE_PALETTE);

/**
 * Returns the appropriate theme based on the active reality.
 */
export function getTheme(reality: Reality): Theme {
  return reality === 'exercise' ? exerciseTheme : realTheme;
}

/** Default theme (Real mode) */
export const theme = realTheme;

export type AppTheme = typeof realTheme;
