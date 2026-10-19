import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    header: {
      background: string;
    };
    toggle: {
      track: string;
      thumb: string;
    };
  }
  interface PaletteOptions {
    header?: {
      background?: string;
    };
    toggle?: {
      track?: string;
      thumb?: string;
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

/**
 * Palantir MUI theme.
 * Derived from Figma design tokens (Figma node 132:52) and tokens.css.
 */
export const theme = createTheme({
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
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
    },
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#9a9a9a',
    },
    header: {
      background: '#d9d9d9',
    },
    toggle: {
      track: '#9a9a9a',
      thumb: '#d9d9d9',
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
          backgroundColor: '#d9d9d9',
          color: '#000000',
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

export type AppTheme = typeof theme;
