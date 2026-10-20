import Box from '@mui/material/Box';
import { Outlet } from 'react-router';
import type { FC } from 'react';

import { Navbar } from '@/components/layout/Navbar';

import { styles } from './RootLayout.styles';

export const RootLayout: FC = () => {
  return (
    <>
      {/* TODO: pass the signed-in user's name (from Keycloak) as `userName`. */}
      <Navbar />
      <Box component="main" sx={styles.main}>
        <Outlet />
      </Box>
    </>
  );
};
