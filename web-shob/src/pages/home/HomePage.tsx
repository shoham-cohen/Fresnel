import { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useSearchParams } from 'react-router';
import { pageStyles } from '@/styles/page.styles';
import { NarrativeDetailsPanel } from '@/features/narratives';
import { NarrativesTable } from '@/components/NarrativesTable';
import type { Narrative } from '@/interfaces/narrative.interface';
import { useRecentNarratives, useToggleNarrativeFlag } from '@/hooks/narratives.hook';

const RECENT_HOURS = 24;
// TODO: the signed-in user's area (arena), once it comes from Keycloak / Mirage.
const AREA_LABEL = 'ישראל';

export const HomePage = () => {
  const toggleFlag = useToggleNarrativeFlag();
  const { narratives, tableStatus, refetch } = useRecentNarratives(RECENT_HOURS);

  // The open narrative lives in the URL (?narrativeId=), which the details panel reads too.
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('narrativeId');

  const handleSelect = useCallback(
    (narrative: Narrative) => {
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
      <title>מסך ראשי · Palantir</title>
      <Box sx={pageStyles.areaTag}>{AREA_LABEL}</Box>
      <Typography component="h1" sx={pageStyles.title}>
        כל ההתראות
      </Typography>
      <NarrativesTable
        narratives={narratives}
        status={tableStatus}
        onRetry={refetch}
        onToggleFlag={toggleFlag}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
      <NarrativeDetailsPanel />
    </>
  );
};
