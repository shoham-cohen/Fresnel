import { useCallback, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { pageStyles } from '@/styles/page.styles';
import { NarrativesTable } from '@/components/NarrativesTable';
import type { Narrative } from '@/interfaces/narrative.interface';
import { useRecentNarratives, useToggleNarrativeFlag } from '@/hooks/narratives.hook';

const RECENT_HOURS = 24;
// TODO: the signed-in user's area (arena), once it comes from Keycloak / Mirage.
const AREA_LABEL = 'ישראל';

export const HomePage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const toggleFlag = useToggleNarrativeFlag();
  const { narratives, tableStatus, refetch } = useRecentNarratives(RECENT_HOURS);

  const handleSelect = useCallback((narrative: Narrative) => {
    setSelectedId(narrative.narrativeId);
  }, []);

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
    </>
  );
};
