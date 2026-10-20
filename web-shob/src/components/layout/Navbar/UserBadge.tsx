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

// Shown only if the Keycloak token has no name claim.
const DEFAULT_USER_NAME = 'שם משתמש';

export interface UserBadgeProps {
  userName?: string;
  onLogout: () => void;
}

/** Avatar and name; clicking the avatar opens the user menu. Figma: carbon:user-avatar-filled-alt (146:67) + name (146:68). */
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
            {/* The icon points right; flip it so it points out of the page in RTL. */}
            <LogoutIcon fontSize="small" sx={styles.logoutIcon} />
          </ListItemIcon>
          התנתקות
        </MenuItem>
      </Menu>
    </Box>
  );
}
