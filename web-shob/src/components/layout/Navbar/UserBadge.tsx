import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import userAvatarIcon from '@/assets/icons/user-avatar.svg';

import { styles } from './UserBadge.styles';

const DEFAULT_USER_NAME = 'שם משתמש';

export interface UserBadgeProps {
  userName?: string;
  onLogout: () => void;
}

export function UserBadge({ userName = DEFAULT_USER_NAME, onLogout }: UserBadgeProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = anchorEl !== null;

  return (
    <Box sx={styles.badge}>
      <ButtonBase
        type="button"
        aria-label="תפריט משתמש"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
        sx={styles.avatarButton}
      >
        <Avatar src={userAvatarIcon} alt="" sx={styles.avatar} />
      </ButtonBase>
      <Typography component="span" sx={styles.name}>
        {userName}
      </Typography>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={styles.logoutIcon} />
          </ListItemIcon>
          התנתקות
        </MenuItem>
      </Menu>
    </Box>
  );
}
