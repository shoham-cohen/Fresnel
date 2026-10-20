import { pageStyles } from '@/styles/page.styles';
import { useCallback, useMemo, useState } from 'react';
import { toSortParams } from '@/utilities/narrative.utility';
import type { Narrative } from '@/interfaces/narrative.interface';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import type { NarrativesQuery } from '@/interfaces/narrative-api.interface';
import { NarrativesTable, type SortState } from '@/components/NarrativesTable';
import { useNarratives, useToggleNarrativeFlag } from '@/hooks/narratives.hook';

export const NarrativeHistoryPage = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState | null>(null);
  const [pageSize, setPageSize] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const query = useMemo<NarrativesQuery>(
    () => ({ page, pageSize: pageSize ?? undefined, ...toSortParams(sort) }),
    [page, pageSize, sort],
  );
  
  const toggleFlag = useToggleNarrativeFlag();
  const { narratives, total, tableStatus, refetch, isRefetching } = useNarratives(query, {
    enabled: pageSize !== null,
  });

  const handleSelect = useCallback((narrative: Narrative) => {
    setSelectedId((current) => (current === narrative.rowId ? null : narrative.rowId));
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
      <Box sx={pageStyles.tableColumn}>
        <NarrativesTable
          sort={sort}
          onRetry={refetch}
          onToggleFlag={toggleFlag}
          status={tableStatus}
          narratives={narratives}
          selectedId={selectedId}
          paging={{ page, total, onPageChange: setPage, onPageSizeChange: handlePageSizeChange }}
          onSortChange={(next) => {
            setSort(next);
            setPage(1);
          }}
          onSelect={handleSelect}
        />
      </Box>
    </Box>
  );
};
