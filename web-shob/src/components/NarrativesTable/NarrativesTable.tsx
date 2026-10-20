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

import { useMemo, useState, type FC } from 'react';
import { MessageRow } from './components/MessageRow/MessageRow';
import { SORTABLE_COLUMNS } from './constants/columns.constant';
import type { Narrative } from '@/interfaces/narrative.interface';
import type { FlagColor } from './interfaces/flag-color.interface';
import type { SortKey, SortState } from './interfaces/sort.interface';
import { NarrativeRow } from './components/NarrativeRow/NarrativeRow';
import { nextSort, sortNarratives } from './utilities/sort-narratives.utility';
import { COLUMN_STYLES, styles, TOOLTIP_SLOT_PROPS } from './NarrativesTable.styles';

export type NarrativesTableStatus = 'loading' | 'error' | 'ready';

export interface NarrativesTableProps {
  onRetry?: () => void;
  flagColor?: FlagColor;
  sort?: SortState | null;
  firstRowNumber?: number;
  selectedId?: string | null;
  status?: NarrativesTableStatus;
  narratives: readonly Narrative[];
  onSortChange?: (sort: SortState) => void;
  onSelect?: (narrative: Narrative) => void;
  onToggleFlag?: (narrative: Narrative) => void;
}

export const NarrativesTable: FC<NarrativesTableProps> = ({
  onRetry,
  onSelect,
  narratives,
  onSortChange,
  onToggleFlag,
  flagColor = 'primary',
  status = 'ready',
  selectedId = null,
  firstRowNumber = 1,
  sort: controlledSort,
}: NarrativesTableProps) => {
  const [localSort, setLocalSort] = useState<SortState | null>(null);

  const isSortControlled = controlledSort !== undefined;
  const sort = isSortControlled ? controlledSort : localSort;

  const sorted = useMemo(
    () => (isSortControlled ? narratives : sortNarratives(narratives, localSort)),
    [narratives, localSort, isSortControlled],
  );

  const handleSort = (key: SortKey) => {
    const next = nextSort(sort, key);

    if (!isSortControlled) {
      setLocalSort(next);
    }
    onSortChange?.(next);
  };

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

    if (sorted.length === 0) {
      return (
        <MessageRow>
          <Typography color="text.secondary">אין התראות להצגה</Typography>
        </MessageRow>
      );
    }

    return sorted.map((narrative, index) => (
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
  );
};
