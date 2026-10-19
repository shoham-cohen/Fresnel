import { alpha, type SxProps, type Theme } from '@mui/material/styles';

export const styles = {
  clickableRow: {
    cursor: 'pointer',
  },
  row: {
    '&.Mui-selected, &.Mui-selected:hover': {
      bgcolor: (theme) => alpha(theme.palette.primary.light, 0.8),
    },
    '& > td': {
      height: 68,
      borderBottom: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
      fontSize: 16,
      fontWeight: 'fontWeightLight',
    },
  },
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
  flag: {
    color: 'text.primary',
  },
  flagged: {
    color: 'primary.main',
  },
} satisfies Record<string, SxProps<Theme>>;
