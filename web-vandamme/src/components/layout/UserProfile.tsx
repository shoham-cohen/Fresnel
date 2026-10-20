import { useState } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Menu, MenuItem, Typography } from '@mui/material'
import { currentUser, logout } from '../../auth/keycloak';


export default function UserProfile() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const user = currentUser()

  return (
    <>
    <Box
      onClick={(e) => setAnchor(e.currentTarget)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        padding: 1
      }}
    >
        <AccountCircleIcon sx={{ fontSize: 45 }} />

      <Typography
        variant="caption"
        sx={{
          fontSize: 15,
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}
      >
       {user.fullName || user.username}
      </Typography>
      </Box>
      <Menu anchorEl={anchor} open={anchor !== null} onClose={() => setAnchor(null)}>
        <MenuItem onClick={logout}>התנתקות</MenuItem>
      </Menu>
    </>
  )
}
