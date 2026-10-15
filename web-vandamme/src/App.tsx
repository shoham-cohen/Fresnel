import { useState } from 'react'
import { Box, Toolbar } from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import ArchiveIcon from '@mui/icons-material/Archive'
import AppHeader from './components/layout/AppHeader'
import NavDrawer, { type NavItem } from './components/layout/NavDrawer'
import ActiveEventsPage from './pages/ActiveEventsPage'
import ClosedEventsPage from './pages/ClosedEventsPage'

type PageId = 'open' | 'closed'

const NAV_ITEMS: readonly NavItem<PageId>[] = [
  { id: 'open', label: 'אירועים פתוחים', icon: <NotificationsActiveIcon /> },
  { id: 'closed', label: 'אירועים שנסגרו', icon: <ArchiveIcon /> },
]

export default function App() {
  const [page, setPage] = useState<PageId>('open')
  // TODO(VD-08): take isSimulation from the אמת / תרגילית switch
  const isSimulation = false

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppHeader />
      <NavDrawer items={NAV_ITEMS} selected={page} onSelect={setPage} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Toolbar />
        {page === 'open' ? <ActiveEventsPage isSimulation={isSimulation} /> : <ClosedEventsPage />}
      </Box>
    </Box>
  )
}
