import { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useSearchParams } from 'react-router';
import { pageStyles } from '@/styles/page.styles';
import { toRowId } from '@/utilities/narrative.utility';
import { NarrativesTable } from '@/components/NarrativesTable';
import type { Narrative } from '@/interfaces/narrative.interface';
import { SELECTION_PARAMS } from '@/features/narratives/constants';
import { DETAILS_PANEL_WIDTH, NarrativeDetailsPanel } from '@/features/narratives';
import { useRecentNarratives, useToggleNarrativeFlag } from '@/hooks/narratives.hook';

const RECENT_HOURS = 24;
// TODO: the signed-in user's area (arena), once it comes from Keycloak / Mirage.
const AREA_LABEL = 'ישראל';

export const HomePage = () => {
  const toggleFlag = useToggleNarrativeFlag();
  const { narratives, tableStatus, refetch } = useRecentNarratives(RECENT_HOURS);

  const [searchParams, setSearchParams] = useSearchParams();
  const narrativeId = searchParams.get(SELECTION_PARAMS.narrativeId);
  const selectedId =
    narrativeId && toRowId(narrativeId, searchParams.get(SELECTION_PARAMS.simulationId));

  const handleSelect = useCallback(
    (narrative: Narrative) => {
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        const current = next.get(SELECTION_PARAMS.narrativeId);
        const isSelected =
          current !== null &&
          toRowId(current, next.get(SELECTION_PARAMS.simulationId)) === narrative.rowId;

        next.delete(SELECTION_PARAMS.narrativeId);
        next.delete(SELECTION_PARAMS.simulationId);

        if (!isSelected) {
          next.set(SELECTION_PARAMS.narrativeId, narrative.narrativeId);
          if (narrative.simulationId) {
            next.set(SELECTION_PARAMS.simulationId, narrative.simulationId);
          }
        }

        return next;
      });
    },
    [setSearchParams],
  );

  return (
    <>
      <title>מסך ראשי · Palantir</title>
      <Box sx={pageStyles.areaTag}>{AREA_LABEL}</Box>
      <Typography component="h1" sx={pageStyles.title}>
        כל ההתראות
      </Typography>
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
          narratives={narratives}
          onToggleFlag={toggleFlag}
        />
      </Box>
      <NarrativeDetailsPanel />
    </>
  );
};
