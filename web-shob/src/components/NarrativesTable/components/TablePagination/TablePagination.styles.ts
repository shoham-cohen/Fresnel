import type { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  bar: {
    mt: '16px',
    minHeight: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  range: {
    fontSize: 14,
    color: 'text.secondary',
    fontWeight: 'fontWeightLight',
  },
} satisfies Record<string, SxProps<Theme>>;
