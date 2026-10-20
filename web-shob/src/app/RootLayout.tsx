import type { FC } from 'react';
import Box from '@mui/material/Box';
import { Outlet } from 'react-router';
import { useReality } from '@/hooks';
import { styles } from './RootLayout.styles';
import { Navbar } from '@/components/layout/Navbar';

export const RootLayout: FC = () => {
  const { reality } = useReality();

  return (
    <>
      {/* TODO: pass the signed-in user's name (from Keycloak) as `userName`. */}
      <Navbar />
      <Box component="main" sx={styles.main}>
        <Outlet key={reality} />
      </Box>
    </>
  );
};
