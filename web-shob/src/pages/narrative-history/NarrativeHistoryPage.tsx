import { useCallback, useMemo, useState } from 'react';
import { pageStyles } from '@/styles/page.styles';
import { useNarratives, useToggleNarrativeFlag } from '@/hooks/narratives.hook';
import { toSortParams } from '@/utilities/narrative.utility';
import type { Narrative } from '@/interfaces/narrative.interface';
import type { NarrativesQuery } from '@/interfaces/narrative-api.interface';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { NarrativesTable, type SortState } from '@/components/NarrativesTable';

const PAGE_SIZE = 20;

export const NarrativeHistoryPage = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortState | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const query = useMemo<NarrativesQuery>(
    () => ({ page, pageSize: PAGE_SIZE, ...toSortParams(sort) }),
    [page, sort],
  );
  const toggleFlag = useToggleNarrativeFlag();
  const { narratives, tableStatus, refetch, isRefetching } = useNarratives(query);

  const handleSelect = useCallback((narrative: Narrative) => {
    setSelectedId(narrative.narrativeId);
  }, []);

  return (
    <>
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
      <NarrativesTable
        sort={sort}
        onRetry={refetch}
        onToggleFlag={toggleFlag}
        status={tableStatus}
        narratives={narratives}
        selectedId={selectedId}
        firstRowNumber={(page - 1) * PAGE_SIZE + 1}
        onSortChange={(next) => {
          setSort(next);
          setPage(1);
        }}
        onSelect={handleSelect}
      />
    </>
  );
};
