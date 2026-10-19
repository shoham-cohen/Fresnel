import { useMemo, useState } from 'react';
import { pageStyles } from '@/styles/page.style';
import { useNarratives } from '@/hooks/narratives.hook';
import { toSortParams } from '@/utilities/narrative.utility';
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
  const { narratives, tableStatus, refetch, isRefetching } = useNarratives(query);

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
        status={tableStatus}
        narratives={narratives}
        selectedId={selectedId}
        firstRowNumber={(page - 1) * PAGE_SIZE + 1}
        onSortChange={(next) => {
          setSort(next);
          setPage(1);
        }}
        onSelect={(narrative) => {
          setSelectedId(narrative.narrativeId);
        }}
      />
    </>
  );
};
