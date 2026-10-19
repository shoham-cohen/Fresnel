import type { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  track: {
    display: 'flex',
    gap: '2px',
    width: 222,
    height: 41,
    p: '2px 3px',
    borderRadius: (theme: Theme) => `${theme.shape.borderRadius}px`,
    bgcolor: 'toggle.track',
  } satisfies SxProps<Theme>,
  option: (isSelected: boolean): SxProps<Theme> => ({
    width: 107,
    height: 37,
    border: 0,
    borderRadius: (theme: Theme) => `${theme.shape.borderRadius}px`,
    bgcolor: (theme: Theme) => (isSelected ? theme.palette.toggle.thumb : 'transparent'),
    fontSize: (theme: Theme) => theme.typography.fontSize,
    fontWeight: isSelected ? 'fontWeightMedium' : 'fontWeightLight',
    color: 'text.primary',
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  }),
};

