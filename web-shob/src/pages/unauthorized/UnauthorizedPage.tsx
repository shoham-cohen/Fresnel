import type { FC } from 'react';
import { login } from '@/auth/keycloak';
import { Box, Button, Typography } from '@mui/material';

import { styles } from './UnauthorizedPage.styles';

export const UnauthorizedPage: FC = () => (
  <Box sx={styles.root}>
    <title>אין גישה · Palantir</title>
    <Typography component="h1" sx={styles.title}>
      אין גישה למערכת
    </Typography>
    <Typography sx={styles.message}>
      לא הצלחנו לאמת את המשתמש שלך. אפשר לנסות להתחבר מחדש.
    </Typography>
    <Button variant="contained" onClick={() => void login()}>
      התחברות מחדש
    </Button>
  </Box>
);
