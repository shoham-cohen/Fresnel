import { createTheme } from '@mui/material'

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
})
