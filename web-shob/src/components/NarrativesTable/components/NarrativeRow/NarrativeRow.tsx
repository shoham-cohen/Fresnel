import { styles } from './NarrativeRow.styles';
import type { FC, KeyboardEvent } from 'react';
import { COLUMN_STYLES, TOOLTIP_SLOT_PROPS } from '../../NarrativesTable.styles';
import { formatDate, formatTime } from '@/lib/formatDateTime';
import type { Narrative } from '@/interfaces/narrative.interface';
import { VIEWS_COUNT_MAX } from '../../constants/columns.constant';
import { Box, Tooltip, TableRow, TableCell, Typography } from '@mui/material';

const viewsFormat = new Intl.NumberFormat('he-IL');

interface NarrativeRowProps {
  selected: boolean;
  rowNumber: number;
  narrative: Narrative;
  onSelect?: (narrative: Narrative) => void;
}

export const NarrativeRow: FC<NarrativeRowProps> = ({
  selected,
  rowNumber,
  onSelect,
  narrative,
}) => {
  const views = Math.min(Math.max(narrative.viewsCount, 0), VIEWS_COUNT_MAX);
  const fill = Math.round((views / VIEWS_COUNT_MAX) * 100);
  const viewsLabel = `${viewsFormat.format(narrative.viewsCount)} צפיות`;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(narrative);
    }
  };

  const interactiveProps = onSelect && {
    hover: true,
    tabIndex: 0,
    onKeyDown: handleKeyDown,
    onClick: () => {
      onSelect(narrative);
    },
  };

  return (
    <TableRow
      {...interactiveProps}
      selected={selected}
      aria-current={selected ? 'true' : undefined}
      sx={[styles.row, Boolean(onSelect) && styles.clickableRow]}
    >
      <TableCell sx={[styles.cell, COLUMN_STYLES.number]}>
        <Box sx={styles.numberBox}>{rowNumber}</Box>
      </TableCell>
      <TableCell sx={[styles.cell, COLUMN_STYLES.subject, styles.subjectCell]}>
        <Typography sx={styles.title}>{narrative.title}</Typography>
        {narrative.summary && <Typography sx={styles.summary}>{narrative.summary}</Typography>}
      </TableCell>
      <TableCell sx={[styles.cell, COLUMN_STYLES.location]}>{narrative.locationName}</TableCell>
      <TableCell sx={[styles.cell, COLUMN_STYLES.detectedAt]}>
        <Box component="time" dateTime={narrative.detectedAt} sx={styles.dateTime}>
          <span>{formatDate(narrative.detectedAt)}</span>
          <span>{formatTime(narrative.detectedAt)}</span>
        </Box>
      </TableCell>
      <TableCell sx={[styles.cell, COLUMN_STYLES.viewsCount]}>
        <Tooltip
          arrow
          describeChild
          placement="top"
          title={viewsLabel}
          enterDelay={200}
          slotProps={TOOLTIP_SLOT_PROPS}
        >
          <Box
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={fill}
            sx={styles.trafficBar}
            aria-label="היקף תנועה"
            aria-valuetext={viewsLabel}
          >
            <Box sx={[styles.trafficFill, { width: `${String(fill)}%` }]} />
          </Box>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
