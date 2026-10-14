import { useState } from 'react'
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import ArchiveIcon from '@mui/icons-material/Archive'
import logoMark from './assets/mark.png'
import logoFull from './assets/logo-full.png'
import EventList from './EventList'
import { MOCK_EVENTS } from './mockEvents'

const DRAWER_WIDTH = 240

const NAV_ITEMS = [
  { id: 'open', label: 'אירועים פתוחים', icon: <NotificationsActiveIcon /> },
  { id: 'closed', label: 'אירועים שנסגרו', icon: <ArchiveIcon /> },
] as const

type NavId = (typeof NAV_ITEMS)[number]['id']

export default function App() {
  const [selected, setSelected] = useState<NavId>('open')
  const current = NAV_ITEMS.find((item) => item.id === selected)!
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const selectedEvent = MOCK_EVENTS.find((event) => event.id === selectedEventId)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{ zIndex: (t) => t.zIndex.drawer + 1, bgcolor: 'background.default', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar>
          <Box component="img" src={logoMark} alt="" sx={{ height: 36, mr: 1.5 }} />
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.12em' }}>
              VAN DAMME
            </Typography>
            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500 }}>
              ניהול אירוע
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          {NAV_ITEMS.map((item) => (
            <ListItemButton key={item.id} selected={item.id === selected} onClick={() => setSelected(item.id)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Toolbar />
        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, minHeight: 0 }}>
          <Box sx={{ width: 360, flexShrink: 0 }}>
            <EventList
              title={current.label}
              events={selected === 'open' ? MOCK_EVENTS : []}
              selectedId={selectedEventId}
              onSelect={setSelectedEventId}
            />
          </Box>
          <Paper
            variant="outlined"
            sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 6, textAlign: 'center' }}
          >
            {selectedEvent ? (
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {selectedEvent.title}
              </Typography>
            ) : (
              <>
                <Box component="img" src={logoFull} alt="Van Damme" sx={{ width: 220, maxWidth: '100%', opacity: 0.85, mb: 3 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  בחר אירוע כדי להתחיל לנהל
                </Typography>
                <Typography sx={{ color: 'text.secondary', maxWidth: 420 }}>
                  בחר אירוע מהרשימה בצד ימין כדי לצפות במידע, לתקשר עם הגורמים הרלוונטיים ולנהל את הטיפול בו.
                </Typography>
              </>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
