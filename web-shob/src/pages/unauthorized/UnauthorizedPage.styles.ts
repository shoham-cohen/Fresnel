import type { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  root: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '16px',
    textAlign: 'center',
  },
  title: {
    lineHeight: 'normal',
    fontSize: 21,
    fontWeight: 'fontWeightBold',
  },
  message: {
    fontSize: 16,
    color: 'text.secondary',
    fontWeight: 'fontWeightLight',
  },
} satisfies Record<string, SxProps<Theme>>;
