import { useCallback } from 'react';
import { pageStyles } from '@/styles/page.styles';
import { useRecentNarratives, useToggleNarrativeFlag } from '@/hooks/narratives.hook';
import { Box, Typography } from '@mui/material';
import { NarrativesTable } from '@/components/NarrativesTable';
import { DETAILS_PANEL_WIDTH, NarrativeDetailsPanel } from '@/features/narratives';
import { useSearchParams } from 'react-router';
import { FilterBar } from '@/components/FilterBar';
import { useNarrativeFilters } from './useAlertFilters';

const RECENT_HOURS = 24;
const AREA_LABEL = 'ישראל';

export const NarrativeHistoryPage = () => {
  const toggleFlag = useToggleNarrativeFlag();
  const { narratives, tableStatus, refetch } = useRecentNarratives(RECENT_HOURS);
  
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

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('narrativeId');

  const handleSelect = useCallback(
    (narrative: any) => {
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        next.set('narrativeId', narrative.narrativeId);
        return next;
      });
    },
    [setSearchParams],
  );

  return (
    <>
      <title>מסך היסטוריית התראות · Palantir</title>
      <Box sx={pageStyles.areaTag}>{AREA_LABEL}</Box>
      <Typography component="h1" sx={pageStyles.title}>
        היסטוריית התראות
      </Typography>

      {/* מיפוי מפורש בין המשתנים של ה-Hook לבין מה ש-FilterBar דורשת */}
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

      <Box
        sx={{
          ...pageStyles.besideDetailsPanel,
          marginInlineEnd: selectedId ? `${String(DETAILS_PANEL_WIDTH)}px` : 0,
        }}
      >
        <NarrativesTable
          flagColor="alert"
          onRetry={refetch}
          status={tableStatus}
          selectedId={selectedId}
          onSelect={handleSelect}
          narratives={filteredAlerts}
          onToggleFlag={toggleFlag}
        />
      </Box>
      <NarrativeDetailsPanel />
    </>
  );
};