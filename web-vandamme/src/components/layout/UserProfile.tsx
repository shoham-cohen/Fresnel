import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Typography } from '@mui/material'
import { mockUser } from '../../mock/userMock';


export default function UserProfile() {
  return (
    <Box
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
       {mockUser.fullName}
      </Typography>
      </Box>
  )
}