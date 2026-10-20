import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import { styles } from './LogoutButton.styles';

export interface LogoutButtonProps {
  onLogout: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <Tooltip title="התנתקות">
      <IconButton type="button" aria-label="התנתקות" onClick={onLogout} sx={styles.button}>
        {/* The icon points right; flip it so it points out of the page in RTL. */}
        <LogoutIcon sx={styles.icon} />
      </IconButton>
    </Tooltip>
  );
}
