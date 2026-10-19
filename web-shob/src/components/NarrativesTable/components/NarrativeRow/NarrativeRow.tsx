import { FlagIcon } from '@/icons/FlagIcon';
import { formatArenas } from '@/constants/arena.constant';
import { styles } from './NarrativeRow.styles';
import { memo, type FC, type KeyboardEvent } from 'react';
import { formatDate, formatTime } from '@/lib/formatDateTime';
import type { Narrative } from '@/interfaces/narrative.interface';
import { VIEWS_COUNT_MAX } from '../../constants/columns.constant';
import { COLUMN_STYLES, TOOLTIP_SLOT_PROPS } from '../../NarrativesTable.styles';
import { Box, Tooltip, TableRow, TableCell, IconButton, Typography } from '@mui/material';

const viewsFormat = new Intl.NumberFormat('he-IL');

interface NarrativeRowProps {
  selected: boolean;
  rowNumber: number;
  narrative: Narrative;
  onSelect?: (narrative: Narrative) => void;
  onToggleFlag?: (narrative: Narrative) => void;
}

const NarrativeRowComponent: FC<NarrativeRowProps> = ({
  selected,
  rowNumber,
  onSelect,
  narrative,
  onToggleFlag,
}) => {
  const views = Math.min(Math.max(narrative.viewsCount, 0), VIEWS_COUNT_MAX);
  const fill = Math.round((views / VIEWS_COUNT_MAX) * 100);
  const viewsLabel = `${viewsFormat.format(narrative.viewsCount)} צפיות`;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.target !== event.currentTarget) return;

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
      <TableCell sx={[styles.cell, COLUMN_STYLES.arena]}>{formatArenas(narrative.arena)}</TableCell>
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
      <TableCell sx={[styles.cell, COLUMN_STYLES.flag]}>
        {onToggleFlag ? (
          <IconButton
            size="small"
            aria-label="סימון התראה"
            aria-pressed={narrative.isFlagged}
            sx={narrative.isFlagged ? styles.flagged : styles.flag}
            onClick={(event) => {
              event.stopPropagation();
              onToggleFlag(narrative);
            }}
          >
            <FlagIcon filled={narrative.isFlagged} />
          </IconButton>
        ) : (
          narrative.isFlagged && <FlagIcon filled aria-label="התראה מסומנת" sx={styles.flagged} />
        )}
      </TableCell>
    </TableRow>
  );
};

export const NarrativeRow = memo(NarrativeRowComponent);
