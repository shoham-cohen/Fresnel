import { TABLE_ROW_HEIGHT } from '../../constants/columns.constant';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import { ANOMALY_TAG_LABEL_OFFSET, ANOMALY_TAG_SIZE } from '../../constants/anomaly-tag.constant';

export const styles = {
  clickableRow: {
    cursor: 'pointer',
  },
  row: {
    '&.Mui-selected, &.Mui-selected:hover': {
      bgcolor: (theme) => alpha(theme.palette.primary.light, 0.8),
    },
    '& > td': {
      height: TABLE_ROW_HEIGHT,
      borderBottom: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
      fontSize: 16,
      fontWeight: 'fontWeightLight',
    },
  },
  cell: {
    p: 0,
  },
  numberCell: {
    position: 'relative',
  },
  anomalyTag: {
    position: 'absolute',
    top: 0,
    insetInlineStart: 0,
    width: ANOMALY_TAG_SIZE,
    height: ANOMALY_TAG_SIZE,
    pointerEvents: 'none',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      bgcolor: 'header.background',
      clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
    },
  },
  anomalyTagLabel: {
    display: 'flex',
    position: 'absolute',
    width: 0,
    height: 0,
    fontSize: 11,
    lineHeight: 1.15,
    whiteSpace: 'pre',
    textAlign: 'center',
    alignItems: 'center',
    color: 'header.text',
    justifyContent: 'center',
    transform: 'rotate(45deg)',
    top: ANOMALY_TAG_LABEL_OFFSET,
    fontWeight: 'fontWeightMedium',
    insetInlineStart: ANOMALY_TAG_LABEL_OFFSET,
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
    width: '100%',
    maxWidth: 226,
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
  flaggedAlert: {
    color: '#D82828',
  },
} satisfies Record<string, SxProps<Theme>>;
