import type { FC } from 'react';
import { SvgIcon, type SvgIconProps } from '@mui/material';

const OUTER = 'M4.3125 21.5625H2.875V1.4375H20.125L15.9563 7.90625L20.125 14.375H4.3125V21.5625Z';
const INNER_CUTOUT = 'M4.3125 12.9375H17.4872L14.2312 7.90625L17.4872 2.875H4.3125V12.9375Z';

interface FlagIconProps extends SvgIconProps {
  filled?: boolean;
}

export const FlagIcon: FC<FlagIconProps> = ({ filled = false, ...props }) => {
  return (
    <SvgIcon viewBox="0 0 23 23" {...props}>
      <path d={filled ? OUTER : `${OUTER}${INNER_CUTOUT}`} />
    </SvgIcon>
  );
};
