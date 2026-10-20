import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router';

import { navItems } from '@/routes/paths';

import { LogoutButton } from './LogoutButton';
import { styles } from './Navbar.styles';
import { RealityToggle } from './RealityToggle';
import { UserBadge } from './UserBadge';

export interface NavbarProps {
  userName?: string;
  onLogout: () => void;
}

export function Navbar({ userName, onLogout }: NavbarProps) {
  return (
    <AppBar position="static" component="header" elevation={0} sx={styles.appBar}>
      <Toolbar disableGutters sx={styles.toolbar}>
        <Typography component="span" sx={styles.wordmark}>
          Palantir
        </Typography>
        <Box component="nav" aria-label="ניווט ראשי">
          <Box component="ul" sx={styles.navList}>
            {navItems.map((item) => (
              <Box component="li" key={item.path}>
                <Link component={NavLink} to={item.path} end sx={styles.navLink}>
                  {item.label}
                </Link>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={styles.endSection}>
          <RealityToggle />
          <UserBadge userName={userName} />
          <LogoutButton onLogout={onLogout} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
