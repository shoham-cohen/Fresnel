import type { SxProps, Theme } from '@mui/material/styles';

// Figma 264:3569, the header above the narratives table. Measured from a screenshot.
export const pageStyles = {
  areaTag: {
    display: 'grid',
    placeItems: 'center',
    width: 133,
    height: 24,
    borderRadius: 1,
    bgcolor: 'primary.light',
    fontSize: 14,
    fontWeight: 'fontWeightLight',
  },
  title: {
    my: '16px',
    lineHeight: 'normal',
    fontSize: 21,
    fontWeight: 'fontWeightBold',
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
