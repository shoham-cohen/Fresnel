import { Outlet } from 'react-router';

import { Navbar } from '@/components/layout/Navbar';

import styles from './RootLayout.module.css';

export function RootLayout() {
  return (
    <>
      {/* TODO: pass the signed-in user's name (from Keycloak) as `userName`. */}
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}
