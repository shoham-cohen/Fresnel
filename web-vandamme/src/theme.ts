
import { createTheme } from '@mui/material'

const scrollThumbReal = 'rgba(63, 214, 238, 0.25)'
const scrollThumbHoverReal = 'rgba(63, 214, 238, 0.45)'

const scrollThumbSimulation = 'rgba(182, 156, 255, 0.3)'
const scrollThumbHoverSimulation = 'rgba(182, 156, 255, 0.55)'

// מצב אמת — כחול כהה וטורקיז
export const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: { main: '#3fd6ee' },
    secondary: { main: '#ff4d3d' },
    background: {
      default: '#020a19',
      paper: '#081427',
    },
    divider: 'rgba(63, 214, 238, 0.15)',
  },
  typography: {
    fontFamily: 'Rubik, Arial, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${scrollThumbReal} transparent`,
        },
        '*:hover': {
          scrollbarColor: `${scrollThumbHoverReal} transparent`,
        },
        '*::-webkit-scrollbar': {
          width: 8,
          height: 8,
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: scrollThumbReal,
          borderRadius: 8,
          border: '2px solid transparent',
          backgroundClip: 'content-box',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: scrollThumbHoverReal,
        },
      },
    },
  },
})

// מצב תרגילית — סגול כהה וסגול בהיר
export const simulationTheme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: { main: '#B69CFF' },
    secondary: { main: '#FFB86B' },
    background: {
      default: '#100B1D',
      paper: '#1B1430',
    },
    divider: 'rgba(182, 156, 255, 0.18)',
  },
  typography: {
    fontFamily: 'Rubik, Arial, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${scrollThumbSimulation} transparent`,
        },
        '*:hover': {
          scrollbarColor: `${scrollThumbHoverSimulation} transparent`,
        },
        '*::-webkit-scrollbar': {
          width: 8,
          height: 8,
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: scrollThumbSimulation,
          borderRadius: 8,
          border: '2px solid transparent',
          backgroundClip: 'content-box',
        },
        '*::-webkit-scrollbar-thumb:hover': {
          backgroundColor: scrollThumbHoverSimulation,
        },
      },
    },
  },
})