import type { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '22px',
  },
  user: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    filter: 'brightness(0) invert(1)',
  },
  name: {
    fontSize: (theme) => theme.typography.fontSize,
    fontWeight: 'fontWeightMedium',
    color: 'header.text',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
  },
  logoutButton: {
    color: 'header.text',
  },
  logoutIcon: {
    transform: 'scaleX(-1)',
  },
} satisfies Record<string, SxProps<Theme>>;
