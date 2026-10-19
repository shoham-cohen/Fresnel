import type { SxProps, Theme } from '@mui/material/styles';

/*
 * Figma 264:3569, a 1440 frame where the table is 1391 wide. Column widths are its
 * proportions; paddings are measured from the frame. Header and body cells share them.
 */
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
  location: {
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
} satisfies Record<string, SxProps<Theme>>;

export const styles = {
  container: {
    border: '1px solid var(--color-table-border)',
    borderRadius: '10px',
  },
  table: {
    tableLayout: 'fixed',
  },
  headCell: {
    p: 0,
    height: 58,
    border: 0,
    bgcolor: 'var(--color-header-bg)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    whiteSpace: 'nowrap',
  },
  // The subject header sits 18px further in than the titles under it.
  subjectHeadCell: {
    paddingInlineStart: '18px',
  },
  // Centers the traffic header over the bar, which is as wide as this box.
  trafficHeadLabel: {
    width: 226,
    textAlign: 'center',
  },
  loading: {
    justifyContent: 'center',
  },
  visuallyHidden: {
    position: 'absolute',
    // sx reads 1 as 100%, so the size is spelled out.
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    clipPath: 'inset(50%)',
    whiteSpace: 'nowrap',
  },
} satisfies Record<string, SxProps<Theme>>;
