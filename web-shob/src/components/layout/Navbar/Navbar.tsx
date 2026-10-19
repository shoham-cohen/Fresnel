import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router';

import { navItems } from '@/routes/paths';

import { styles } from './Navbar.styles';
import { RealityToggle } from './RealityToggle';
import { UserBadge } from './UserBadge';

export interface NavbarProps {
  /** Signed-in user's display name. Defaults to a placeholder until auth exists. */
  userName?: string;
}

/** App header. Figma: "מערכת שו״ב" › mainPage (132:52). */
export function Navbar({ userName }: NavbarProps) {
  return (
    <AppBar position="static" component="header" elevation={0} sx={styles.appBar}>
      <Toolbar disableGutters sx={styles.toolbar}>
        <Typography component="span" sx={styles.wordmark}>
          Palantir
        </Typography>

        <Box component="nav" aria-label="ניווט ראשי">
          <Stack component="ul" direction="row" spacing="116px" sx={styles.navList}>
            {navItems.map((item) => (
              <Box component="li" key={item.path}>
                <Link component={NavLink} to={item.path} end sx={styles.navLink}>
                  {item.label}
                </Link>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box sx={styles.endSection}>
          <RealityToggle />
          <UserBadge userName={userName} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
