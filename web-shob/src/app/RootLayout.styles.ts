import type { SxProps, Theme } from '@mui/material/styles';

// Figma 264:3569: content sits 24px in from the frame edges, 11px under the header, and
// scrolls on its own while the header stays put.
export const styles = {
  main: {
    overflowY: 'auto',
    padding: '11px 24px 18px',
    height: (theme) => `calc(100vh - ${String(theme.customSizes.headerHeight)}px)`,
  },
} satisfies Record<string, SxProps<Theme>>;
