import type { FC } from 'react';
import Box from '@mui/material/Box';
import { useReality } from '@/hooks';
import { Outlet } from 'react-router';
import { useUnauthorized } from '@/hooks/unauthorized.hook';
import { styles } from './RootLayout.styles';
import { logout, userName } from '@/auth/keycloak';
import { Navbar } from '@/components/layout/Navbar';
import { UnauthorizedPage } from '@/pages/unauthorized/UnauthorizedPage';

export const RootLayout: FC = () => {
  const { reality } = useReality();
  const unauthorized = useUnauthorized();

  return (
    <>
      <Navbar userName={userName()} onLogout={() => void logout()} />
      <Box component="main" sx={styles.main}>
        {unauthorized ? <UnauthorizedPage /> : <Outlet key={reality} />}
      </Box>
    </>
  );
};
