import {
  Box,
  Alert,
  Stack,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  Tooltip,
  TableSortLabel,
  CircularProgress,
} from '@mui/material';

import type { FC } from 'react';
import { useTableRows } from './hooks/table-rows.hook';
import type { SortState } from './interfaces/sort.interface';
import { MessageRow } from './components/MessageRow/MessageRow';
import { SORTABLE_COLUMNS } from './constants/columns.constant';
import type { Narrative } from '@/interfaces/narrative.interface';
import type { FlagColor } from './interfaces/flag-color.interface';
import type { NarrativesTablePaging } from './interfaces/paging.interface';
import { NarrativeRow } from './components/NarrativeRow/NarrativeRow';
import { TablePagination } from './components/TablePagination/TablePagination';
import { COLUMN_STYLES, styles, TOOLTIP_SLOT_PROPS } from './NarrativesTable.styles';

export type NarrativesTableStatus = 'loading' | 'error' | 'ready';
export interface NarrativesTableProps {
  onRetry?: () => void;
  flagColor?: FlagColor;
  sort?: SortState | null;
  paging?: NarrativesTablePaging;
  selectedId?: string | null;
  status?: NarrativesTableStatus;
  narratives: readonly Narrative[];
  onSortChange?: (sort: SortState) => void;
  onSelect?: (narrative: Narrative) => void;
  onToggleFlag?: (narrative: Narrative) => void;
}

export const NarrativesTable: FC<NarrativesTableProps> = ({
  paging,
  onRetry,
  onSelect,
  narratives,
  onSortChange,
  onToggleFlag,
  flagColor = 'primary',
  status = 'ready',
  selectedId = null,
  sort: controlledSort,
}: NarrativesTableProps) => {
  const {
    sort,
    rows,
    page,
    total,
    areaRef,
    pageSize,
    handleSort,
    firstRowNumber,
    handlePageChange,
  } = useTableRows({ narratives, controlledSort, onSortChange, paging });

  const renderBody = () => {
    if (status === 'loading') {
      return (
        <MessageRow>
          <Stack role="status" direction="row" spacing={1} sx={styles.loading}>
            <CircularProgress size={20} />
            <Typography>טוען התראות…</Typography>
          </Stack>
        </MessageRow>
      );
    }

    if (status === 'error') {
      return (
        <MessageRow>
          <Alert
            severity="error"
            action={
              onRetry && (
                <Button color="inherit" size="small" onClick={onRetry}>
                  ניסיון נוסף
                </Button>
              )
            }
          >
            לא הצלחנו לטעון את ההתראות.
          </Alert>
        </MessageRow>
      );
    }

    if (rows.length === 0) {
      return (
        <MessageRow>
          <Typography color="text.secondary">אין התראות להצגה</Typography>
        </MessageRow>
      );
    }

    return rows.map((narrative, index) => (
      <NarrativeRow
        key={narrative.rowId}
        onSelect={onSelect}
        narrative={narrative}
        flagColor={flagColor}
        onToggleFlag={onToggleFlag}
        rowNumber={firstRowNumber + index}
        selected={narrative.rowId === selectedId}
      />
    ));
  };

  return (
    <Box sx={styles.root}>
      <Box ref={areaRef} sx={styles.area}>
        <TableContainer sx={styles.container}>
          <Table aria-busy={status === 'loading'} sx={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell sx={[styles.headCell, COLUMN_STYLES.number]}>
                  <Box component="span" sx={styles.visuallyHidden}>
                    מספר
                  </Box>
                </TableCell>
                <TableCell sx={[styles.headCell, COLUMN_STYLES.subject, styles.subjectHeadCell]}>
                  נושא ההתראה
                </TableCell>
                {SORTABLE_COLUMNS.map(({ key, label, tooltip }) => {
                  const direction = sort?.key === key ? sort.direction : null;

                  const button = (
                    <TableSortLabel
                      active={direction !== null}
                      direction={direction ?? 'asc'}
                      onClick={() => {
                        handleSort(key);
                      }}
                    >
                      {label}
                    </TableSortLabel>
                  );

                  const sortLabel = tooltip ? (
                    <Tooltip
                      arrow
                      describeChild
                      title={tooltip}
                      placement="top"
                      slotProps={TOOLTIP_SLOT_PROPS}
                    >
                      {button}
                    </Tooltip>
                  ) : (
                    button
                  );

                  return (
                    <TableCell
                      key={key}
                      sortDirection={direction ?? false}
                      sx={[styles.headCell, COLUMN_STYLES[key]]}
                    >
                      {key === 'viewsCount' ? (
                        <Box sx={styles.trafficHeadLabel}>{sortLabel}</Box>
                      ) : (
                        sortLabel
                      )}
                    </TableCell>
                  );
                })}
                <TableCell sx={[styles.headCell, COLUMN_STYLES.flag]}>
                  <Box component="span" sx={styles.visuallyHidden}>
                    סימון
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderBody()}</TableBody>
          </Table>
        </TableContainer>
      </Box>
      <TablePagination
        page={page}
        total={total}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </Box>
  );
};
