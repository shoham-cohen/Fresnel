import Box from '@mui/material/Box';
import type { FC } from 'react';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';

import userAvatarIcon from '@/assets/icons/user-avatar.svg';

import { styles } from './UserBadge.styles';

const DEFAULT_USER_NAME = 'שם משתמש';

export interface UserBadgeProps {
  userName?: string;
  onLogout: () => void;
}

// The signed-in user, and a button that logs out right away.
export const UserBadge: FC<UserBadgeProps> = ({ userName = DEFAULT_USER_NAME, onLogout }) => {
  return (
    <Box sx={styles.badge}>
      <Box sx={styles.user}>
        <Avatar src={userAvatarIcon} alt="" sx={styles.avatar} />
        <Typography component="span" sx={styles.name}>
          {userName}
        </Typography>
      </Box>
      <Tooltip title="התנתקות">
        <IconButton aria-label="התנתקות" onClick={onLogout} sx={styles.logoutButton}>
          <LogoutIcon sx={styles.logoutIcon} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
