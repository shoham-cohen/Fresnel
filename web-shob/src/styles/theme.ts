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
      border: string;
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
      border?: string;
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
  primary: '#4872A5',
  background: '#ffffff',
  headerBg: '#102B4D',
  headerText: '#ffffff',
  toggleTrack: '#02152B',
  toggleThumb: '#4872A5',
  toggleBorder: '#4872A5',
  accentLight: '#E8F1FC',
  textPrimary: '#000000',
  textSecondary: '#666666',
};

export const EXERCISE_PALETTE = {
  reality: 'exercise' as const,
  primary: '#B99462',
  background: '#ffffff',
  headerBg: '#49311F',
  headerText: '#ffffff',
  toggleTrack: '#684B31',
  toggleThumb: '#B99462',
  toggleBorder: '#B99462',
  accentLight: '#EDE2D3',
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
  toggleBorder: string;
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
        border: config.toggleBorder,
      },
      accent: {
        main: config.primary,
        light: config.accentLight,
      },
    },
    shape: {
      borderRadius: 35,
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

export const realTheme = createRealityTheme(REAL_PALETTE);

export const exerciseTheme = createRealityTheme(EXERCISE_PALETTE);

export function getTheme(reality: Reality): Theme {
  return reality === 'exercise' ? exerciseTheme : realTheme;
}

export const theme = realTheme;

export type AppTheme = typeof realTheme;