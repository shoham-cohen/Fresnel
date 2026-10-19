import type { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  clickableRow: {
    cursor: 'pointer',
  },
  row: {
    '&.Mui-selected, &.Mui-selected:hover': {
      bgcolor: 'primary.light',
    },
    '& > td': {
      height: 68,
      borderBottom: '1px solid #BFBFBF',
      fontSize: 16,
      fontWeight: 'fontWeightLight',
    },
  },
  // Drops MUI's 16px cell padding; each column sets its own (COLUMN_STYLES).
  cell: {
    p: 0,
  },
  numberBox: {
    display: 'grid',
    placeItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 1,
    bgcolor: 'primary.light',
  },
  subjectCell: {
    overflowWrap: 'anywhere',
  },
  title: {
    lineHeight: 'normal',
    fontSize: 16,
    fontWeight: 'fontWeightBold',
  },
  summary: {
    mt: '8px',
    lineHeight: 'normal',
    fontSize: 14,
    fontWeight: 'fontWeightLight',
  },
  dateTime: {
    display: 'inline-flex',
    gap: 2,
    whiteSpace: 'nowrap',
  },
  trafficBar: {
    display: 'flex',
    // The fill starts on the left in Figma; in RTL that's the flex end.
    justifyContent: 'flex-end',
    width: 226,
    height: 12,
    borderRadius: '6px',
    overflow: 'hidden',
    bgcolor: 'primary.light',
  },
  trafficFill: {
    height: '100%',
    borderRadius: '6px',
    bgcolor: 'primary.main',
  },
} satisfies Record<string, SxProps<Theme>>;
