import type { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  button: {
    color: 'header.text',
  },
  icon: {
    fontSize: 32,
    transform: 'scaleX(-1)',
  },
} satisfies Record<string, SxProps<Theme>>;
