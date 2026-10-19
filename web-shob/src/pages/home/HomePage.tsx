import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { pageStyles } from '@/styles/page.styles';
import { useRecentNarratives } from '@/hooks/narratives.hook';
import { NarrativesTable } from '@/components/NarrativesTable';

const RECENT_HOURS = 24;
// TODO: the signed-in user's area (arena), once it comes from Keycloak / Mirage.
const AREA_LABEL = 'ישראל';

export const HomePage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { narratives, tableStatus, refetch } = useRecentNarratives(RECENT_HOURS);

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
        selectedId={selectedId}
        onSelect={(narrative) => {
          setSelectedId(narrative.narrativeId);
        }}
      />
    </>
  );
};
