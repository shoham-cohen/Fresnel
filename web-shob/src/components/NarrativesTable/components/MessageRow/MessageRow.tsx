import type { ReactNode, FC } from 'react';
import { styles } from './MessageRow.style';
import { TableCell, TableRow } from '@mui/material';
import { COLUMN_COUNT } from '../../constants/columns.constant';

interface MessageRowProps {
  children: ReactNode;
}

export const MessageRow: FC<MessageRowProps> = ({ children }) => {
  return (
    <TableRow>
      <TableCell colSpan={COLUMN_COUNT} align="center" sx={styles.cell}>
        {children}
      </TableCell>
    </TableRow>
  );
};
