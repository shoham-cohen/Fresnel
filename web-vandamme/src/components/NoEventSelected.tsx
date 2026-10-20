import { useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import logoFull from '../assets/logo-full.png'
import AddActionModal from './AddActionModal' // עדכן את הנתיב במידת הצורך בהתאם למבנה התיקיות שלך

export default function NoEventSelected() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Box component="img" src={logoFull} alt="Van Damme" sx={{ width: 220, maxWidth: '100%', opacity: 0.85, mb: 3 }} />
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        בחר אירוע כדי להתחיל לנהל
      </Typography>
      <Typography sx={{ color: 'text.secondary', maxWidth: 420, mb: 3 }}>
        בחר אירוע מהרשימה בצד ימין כדי לצפות במידע, לתקשר עם הגורמים הרלוונטיים ולנהל את הטיפול בו.
      </Typography>
    </>
  )
}