import type { SxProps, Theme } from '@mui/material/styles';

// Figma 264:3569, the header above the narratives table. Measured from a screenshot.
export const pageStyles = {
  areaTag: {
    display: 'grid',
    placeItems: 'center',
    width: 133,
    height: 24,
    borderRadius: 'var(--radius-sm)',
    bgcolor: 'var(--color-header-bg)',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-light)',
  },
  title: {
    my: '16px',
    lineHeight: 'normal',
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-bold)',
  },
  // A title with actions on the other side (e.g. history's refresh button). Not in Figma yet.
  titleRow: {
    my: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& h1': { my: 0 },
  },
} satisfies Record<string, SxProps<Theme>>;
