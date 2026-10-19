import type { SxProps, Theme } from '@mui/material/styles';

export const styles = {
  track: {
    display: 'flex',
    alignItems: 'center', // Ensures vertical centering
    justifyContent: 'center', // Ensures horizontal centering
    gap: '2px',
    width: 222,
    height: 41,
    p: '1px 2px', // Corrected math: 1px top/bottom, 2px left/right
    border: '1px solid',
    borderColor: 'toggle.border',
    borderRadius: '35px',
    bgcolor: 'toggle.track',
  } satisfies SxProps<Theme>,

  option: (isSelected: boolean): SxProps<Theme> => ({
    width: 107,
    height: 37,
    border: 0,
    borderRadius: '35px',
    bgcolor: isSelected ? 'toggle.thumb' : 'transparent',
    fontSize: 'inherit',
    fontWeight: isSelected ? 'fontWeightMedium' : 'fontWeightLight',
    color: 'header.text',
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
  }),
};
