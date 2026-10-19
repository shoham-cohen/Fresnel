import type { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  badge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
  },
  name: {
    fontSize: (theme) => theme.typography.fontSize,
    fontWeight: 'fontWeightMedium',
    color: 'header.text',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
  },
} satisfies Record<string, SxProps<Theme>>;

