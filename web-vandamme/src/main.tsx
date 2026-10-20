
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import { prefixer } from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'
import { CssBaseline, ThemeProvider } from '@mui/material'

import '@fontsource/rubik/400.css'
import '@fontsource/rubik/500.css'
import '@fontsource/rubik/700.css'

import { theme, simulationTheme } from './theme'
import App from './App'
import {
  EnvironmentProvider,
  useEnvironment,
} from './Context/EnvironmentContext'

const rtlCache = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
})

function ThemedApp() {
  const { isSimulation } = useEnvironment()

  const activeTheme = isSimulation ? simulationTheme : theme

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CacheProvider value={rtlCache}>
      <EnvironmentProvider>
        <ThemedApp />
      </EnvironmentProvider>
    </CacheProvider>
  </StrictMode>,
)