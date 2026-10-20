import type { SxProps, Theme } from '@mui/material/styles';
import { DETAILS_PANEL_TRANSITION } from '@/features/narratives/constants';

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
  titleRow: {
    my: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& h1': { my: 0 },
  },
  fillPage: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  besideDetailsPanel: {
    transition: `margin ${String(DETAILS_PANEL_TRANSITION.duration)}ms ${DETAILS_PANEL_TRANSITION.easing}`,
  },
  tableColumn: {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
} satisfies Record<string, SxProps<Theme>>;
