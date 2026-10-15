import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import logoMark from '../../assets/mark.png'

export default function AppHeader() {
  return (
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
  )
}
