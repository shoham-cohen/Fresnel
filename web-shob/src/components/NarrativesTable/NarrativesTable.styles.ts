import type { TooltipProps } from '@mui/material';
import { TABLE_HEAD_HEIGHT } from './constants/columns.constant';
import type { SxProps, Theme } from '@mui/material/styles';

export const TOOLTIP_SLOT_PROPS = {
  tooltip: {
    sx: {
      px: 1.5,
      py: 1,
      maxWidth: 260,
      fontSize: 14,
      borderRadius: 1,
      textAlign: 'center',
      color: 'header.text',
      bgcolor: 'header.background',
      fontWeight: 'fontWeightLight',
    },
  },
  arrow: {
    sx: { color: 'header.background' },
  },
} satisfies TooltipProps['slotProps'];

export const COLUMN_STYLES = {
  number: {
    width: 90,
    paddingInlineStart: '28px',
    paddingInlineEnd: '30px',
  },
  subject: {
    width: '26.5%',
    paddingInlineEnd: '16px',
  },
  arena: {
    width: '17.4%',
    textAlign: 'center',
  },
  detectedAt: {
    width: '17.4%',
    textAlign: 'center',
  },
  viewsCount: {
    paddingInlineStart: '55px',
  },
  flag: {
    width: 106,
    textAlign: 'center',
  },
} satisfies Record<string, SxProps<Theme>>;

export const styles = {
  container: {
    borderRadius: '10px',
  },
  table: {
    tableLayout: 'fixed',
  },
  headCell: {
    p: 0,
    height: TABLE_HEAD_HEIGHT,
    border: 0,
    bgcolor: 'primary.light',
    fontSize: 16,
    fontWeight: 'fontWeightMedium',
    whiteSpace: 'nowrap',
  },
  subjectHeadCell: {
    paddingInlineStart: '18px',
  },
  trafficHeadLabel: {
    width: 226,
    textAlign: 'center',
  },
  loading: {
    justifyContent: 'center',
  },
  visuallyHidden: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
} satisfies Record<string, SxProps<Theme>>;
