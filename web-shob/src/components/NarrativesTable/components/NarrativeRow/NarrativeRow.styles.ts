import type { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  clickableRow: {
    cursor: 'pointer',
  },
  row: {
    '&.Mui-selected, &.Mui-selected:hover': {
      bgcolor: 'var(--color-header-bg)',
    },
    '& > td': {
      height: 68,
      borderBottom: '1px solid var(--color-table-divider)',
      fontSize: 'var(--font-size-sm)',
      fontWeight: 'var(--font-weight-light)',
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
    borderRadius: 'var(--radius-sm)',
    bgcolor: 'var(--color-header-bg)',
  },
  subjectCell: {
    overflowWrap: 'anywhere',
  },
  title: {
    lineHeight: 'normal',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-bold)',
  },
  summary: {
    mt: '8px',
    lineHeight: 'normal',
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-light)',
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
    bgcolor: 'var(--color-header-bg)',
  },
  trafficFill: {
    height: '100%',
    borderRadius: '6px',
    bgcolor: 'var(--color-bar-fill)',
  },
} satisfies Record<string, SxProps<Theme>>;
