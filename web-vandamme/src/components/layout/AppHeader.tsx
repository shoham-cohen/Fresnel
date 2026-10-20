import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import logoMark from '../../assets/mark.png'
import EnvironmentToggle from './EnvironmentToggle'
import UserProfile from './UserProfile'
import AppNavigationTabs from './AppNavigationTabs'
import type { PageId } from '../../App'

type Props = {
  page: PageId
  onSelect: (page: PageId) => void
}

export default function AppHeader({ page, onSelect }: Props) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        bgcolor: 'background.default',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box component="img" src={logoMark} alt="" sx={{ height: 36, mr: 1.5 }} />
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.12em' }}>
                VAN DAMME
              </Typography>
              <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500 }}>
                ניהול אירוע
              </Typography>
            </Box>
          </Box>

          <AppNavigationTabs page={page} onSelect={onSelect} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 3,
            alignItems: 'center',
          }}
        >
          <EnvironmentToggle />
          <UserProfile />
        </Box>
      </Toolbar>
    </AppBar>
  )
}