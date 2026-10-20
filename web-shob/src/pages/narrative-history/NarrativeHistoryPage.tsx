import { pageStyles } from '@/styles/page.styles';
import { useCallback, useMemo, useState } from 'react';
import { toSortParams } from '@/utilities/narrative.utility';
import { useElementHeight } from '@/hooks/element-height.hook';
import type { Narrative } from '@/interfaces/narrative.interface';
import type { NarrativesQuery } from '@/interfaces/narrative-api.interface';
import { useNarratives, useToggleNarrativeFlag } from '@/hooks/narratives.hook';
import { Box, Button, Pagination, Typography, CircularProgress } from '@mui/material';
import { NarrativesTable, rowsThatFit, type SortState } from '@/components/NarrativesTable';

const DEFAULT_PAGE_SIZE = 10;

export const NarrativeHistoryPage = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [tableAreaRef, tableAreaHeight] = useElementHeight<HTMLDivElement>();
  const pageSize = tableAreaHeight ? rowsThatFit(tableAreaHeight) : DEFAULT_PAGE_SIZE;

  const [lastPageSize, setLastPageSize] = useState(pageSize);
  if (pageSize !== lastPageSize) {
    setLastPageSize(pageSize);
    setPage(1);
  }

  const query = useMemo<NarrativesQuery>(
    () => ({ page, pageSize, ...toSortParams(sort) }),
    [page, pageSize, sort],
  );
  const toggleFlag = useToggleNarrativeFlag();
  const { narratives, total, tableStatus, refetch, isRefetching } = useNarratives(query, {
    enabled: tableAreaHeight > 0,
  });

  const pageCount = Math.ceil(total / pageSize);
  const firstRowNumber = (page - 1) * pageSize + 1;
  const lastRowNumber = Math.min(page * pageSize, total);

  const handleSelect = useCallback((narrative: Narrative) => {
    setSelectedId((current) =>
      current === narrative.narrativeId ? null : narrative.narrativeId,
    );
  }, []);

  return (
    <Box sx={pageStyles.fillPage}>
      <title>היסטוריית התראות · Palantir</title>
      <Box sx={pageStyles.titleRow}>
        <Typography component="h1" sx={pageStyles.title}>
          היסטוריית התראות
        </Typography>
        <Button
          size="small"
          color="inherit"
          variant="outlined"
          onClick={refetch}
          disabled={isRefetching}
          startIcon={isRefetching && <CircularProgress size={14} color="inherit" />}
        >
          רענון
        </Button>
      </Box>
      <Box ref={tableAreaRef} sx={pageStyles.tableArea}>
        <NarrativesTable
          sort={sort}
          onRetry={refetch}
          onToggleFlag={toggleFlag}
          status={tableStatus}
          narratives={narratives}
          selectedId={selectedId}
          firstRowNumber={firstRowNumber}
          onSortChange={(next) => {
            setSort(next);
            setPage(1);
          }}
          onSelect={handleSelect}
        />
      </Box>
      <Box sx={pageStyles.pagination}>
        {pageCount > 1 && (
          <>
            <Typography sx={pageStyles.paginationRange}>
              {`מציג ${String(firstRowNumber)}–${String(lastRowNumber)} מתוך ${String(total)}`}
            </Typography>
            <Pagination
              page={page}
              color="primary"
              count={pageCount}
              onChange={(_event, nextPage) => {
                setPage(nextPage);
              }}
            />
          </>
        )}
      </Box>
    </Box>
  );
};
