import { useState } from 'react'
import { Box, Toolbar } from '@mui/material'
import AppHeader from './components/layout/AppHeader'
import ActiveEventsPage from './pages/ActiveEventsPage'
import ClosedEventsPage from './pages/ClosedEventsPage'
import { useEnvironment } from './Context/EnvironmentContext'

export type PageId = 'open' | 'closed'

export default function App() {
  const [page, setPage] = useState<PageId>('open')
  const { isSimulation } = useEnvironment()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppHeader page={page} onSelect={setPage} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Toolbar />
        {page === 'open' ? <ActiveEventsPage isSimulation={isSimulation} /> : <ClosedEventsPage />}
      </Box>
    </Box>
  )
}