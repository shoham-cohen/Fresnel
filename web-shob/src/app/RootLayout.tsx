import Box from '@mui/material/Box';
import { Outlet } from 'react-router';
import type { FC } from 'react';

import { logout, userName } from '@/auth/keycloak';
import { Navbar } from '@/components/layout/Navbar';

import { styles } from './RootLayout.styles';

export const RootLayout: FC = () => {
  return (
    <>
      <Navbar userName={userName()} onLogout={() => void logout()} />
      <Box component="main" sx={styles.main}>
        <Outlet />
      </Box>
    </>
  );
};
