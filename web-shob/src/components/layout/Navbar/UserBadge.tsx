import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import userAvatarIcon from '@/assets/icons/user-avatar.svg';

import { styles } from './UserBadge.styles';

// TODO: remove once the real name comes from Keycloak.
const DEFAULT_USER_NAME = 'שם משתמש';

export interface UserBadgeProps {
  userName?: string;
}

/** Avatar and name. Figma: carbon:user-avatar-filled-alt (146:67) + name (146:68). */
export function UserBadge({ userName = DEFAULT_USER_NAME }: UserBadgeProps) {
  return (
    <Box sx={styles.badge}>
      <Avatar src={userAvatarIcon} alt="" sx={styles.avatar} />
      <Typography component="span" sx={styles.name}>
        {userName}
      </Typography>
    </Box>
  );
}
