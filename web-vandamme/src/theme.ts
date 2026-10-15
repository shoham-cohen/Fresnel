import { createTheme } from '@mui/material'

const scrollThumb = 'rgba(63, 214, 238, 0.25)'
const scrollThumbHover = 'rgba(63, 214, 238, 0.45)'

// Colours taken from the Van Damme logo
export const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: { main: '#3fd6ee' },
    secondary: { main: '#ff4d3d' },
    background: { default: '#020a19', paper: '#081427' },
    divider: 'rgba(63, 214, 238, 0.15)',
  },
  typography: {
    fontFamily: 'Rubik, Arial, sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Thin, dark scrollbars everywhere instead of the light system ones.
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${scrollThumb} transparent`,
        },
        '*:hover': {
          scrollbarColor: `${scrollThumbHover} transparent`,
        },
        // Browsers without scrollbar-color (Safari)
        '*::-webkit-scrollbar': { width: 8, height: 8 },
        '*::-webkit-scrollbar-track': { background: 'transparent' },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: scrollThumb,
          borderRadius: 8,
          border: '2px solid transparent',
          backgroundClip: 'content-box',
        },
        '*::-webkit-scrollbar-thumb:hover': { backgroundColor: scrollThumbHover },
      },
    },
  },
})
