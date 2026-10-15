import { Box, Typography } from '@mui/material'
import logoFull from '../assets/logo-full.png'

// The event pane before an event is picked from the list.
export default function NoEventSelected() {
  return (
    <>
      <Box component="img" src={logoFull} alt="Van Damme" sx={{ width: 220, maxWidth: '100%', opacity: 0.85, mb: 3 }} />
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        בחר אירוע כדי להתחיל לנהל
      </Typography>
      <Typography sx={{ color: 'text.secondary', maxWidth: 420 }}>
        בחר אירוע מהרשימה בצד ימין כדי לצפות במידע, לתקשר עם הגורמים הרלוונטיים ולנהל את הטיפול בו.
      </Typography>
    </>
  )
}
