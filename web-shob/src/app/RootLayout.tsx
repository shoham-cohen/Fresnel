import type { FC } from 'react';
import Box from '@mui/material/Box';
import { useReality } from '@/hooks';
import { Outlet } from 'react-router';
import { styles } from './RootLayout.styles';
import { logout, userName } from '@/auth/keycloak';
import { Navbar } from '@/components/layout/Navbar';

export const RootLayout: FC = () => {
  const { reality } = useReality();

  return (
    <>
      <Navbar userName={userName()} onLogout={() => void logout()} />
      <Box component="main" sx={styles.main}>
        <Outlet key={reality} />
      </Box>
    </>
  );
};
