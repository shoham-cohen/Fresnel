import type { FC } from 'react';
import { Box, Pagination, Typography } from '@mui/material';

import { styles } from './TablePagination.styles';

interface TablePaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const TablePagination: FC<TablePaginationProps> = ({
  page,
  total,
  pageSize,
  onPageChange,
}) => {
  const pageCount = Math.ceil(total / pageSize);
  const firstRow = (page - 1) * pageSize + 1;
  const lastRow = Math.min(page * pageSize, total);

  return (
    <Box sx={styles.bar}>
      {pageCount > 1 && (
        <>
          <Typography sx={styles.range}>
            {`מציג ${String(firstRow)}–${String(lastRow)} מתוך ${String(total)}`}
          </Typography>
          <Pagination
            page={page}
            color="primary"
            count={pageCount}
            onChange={(_event, nextPage) => {
              onPageChange(nextPage);
            }}
          />
        </>
      )}
    </Box>
  );
};
