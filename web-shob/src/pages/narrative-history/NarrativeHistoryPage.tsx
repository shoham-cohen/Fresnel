import { pageStyles } from '@/styles/page.styles';
import { useCallback, useMemo, useState } from 'react';
import { toSortParams } from '@/utilities/narrative.utility';
import type { Narrative } from '@/interfaces/narrative.interface';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import type { NarrativesQuery } from '@/interfaces/narrative-api.interface';
import { NarrativesTable, type SortState } from '@/components/NarrativesTable';
import { useNarratives, useToggleNarrativeFlag } from '@/hooks/narratives.hook';
import { useNarrativeFilters } from './useAlertFilters';
import { FilterBar } from '@/components/FilterBar';

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
    setSelectedId((current) => (current === narrative.narrativeId ? null : narrative.narrativeId));
  }, []);

  const {
    searchTerm,
    startDate,
    endDate,
    selectedLocation,
    setSearchTerm,
    setStartDate,
    setEndDate,
    setSelectedLocation,
    filteredAlerts,
  } = useNarrativeFilters(narratives);

  return (
    <Box sx={pageStyles.fillPage}>
      <title>היסטוריית התראות · Palantir</title>
      <Box sx={pageStyles.titleRow}>
        <Typography component="h1" sx={pageStyles.title}>
          היסטוריית התראות
        </Typography>
      </Box>
      <FilterBar
          searchTerm={searchTerm}
          startDate={startDate}
          endDate={endDate}
          selectedLocation={selectedLocation}
          onSearchChange={setSearchTerm}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onLocationChange={setSelectedLocation}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: '10px' }}>
        <Button
          color="inherit"
          variant="outlined"
          onClick={refetch}
          disabled={isRefetching}
          startIcon={
            isRefetching ? (
              <CircularProgress size={14} color="inherit" />
            ) : undefined
          }
          sx={{
            height: 25,
            minWidth: 20,
            px: 2,
            whiteSpace: 'nowrap',
            borderRadius: 2,
            flexShrink: 0,
          }}
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
          narratives={filteredAlerts}
          selectedId={selectedId}
          paging={{ page, total, onPageChange: setPage, onPageSizeChange: handlePageSizeChange }}
          onSortChange={(next) => {
            setSort(next);
            setPage(1);
          } }
          onSelect={handleSelect} />
      </Box>
    </Box>
  );
};