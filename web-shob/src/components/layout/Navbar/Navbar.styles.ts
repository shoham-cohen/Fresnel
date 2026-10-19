import type { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  appBar: {
    bgcolor: 'header.background',
    color: 'header.text',
    height: (theme) => theme.customSizes.headerHeight,
    justifyContent: 'center',
    paddingInline: '23px 16px',
    boxShadow: 'none',
  },
  toolbar: {
    minHeight: '100% !important',
    display: 'flex',
    alignItems: 'center',
  },
  wordmark: {
    marginInlineEnd: '101px',
    fontSize: 28,
    fontWeight: 'fontWeightBold',
    textTransform: 'uppercase',
    fontFamily: 'inherit',
    color: 'inherit',
  },
  navList: {
    display: 'flex',
    flexDirection: 'row',
    gap: '116px', // Hardcode the exact pixel spacing here
    listStyle: 'none',
    m: 0,
    p: 0,
    alignItems: 'center',
  },
  navLink: {
    color: 'header.text',
    fontSize: 21,
    fontWeight: 'fontWeightLight',
    textDecoration: 'none',
    fontFamily: 'inherit',
    '&[aria-current="page"]': {
      fontSize: 23,
      fontWeight: 'fontWeightBold',
    },
  },
  endSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '56px',
    marginInlineStart: 'auto',
  },
} satisfies Record<string, SxProps<Theme>>;
