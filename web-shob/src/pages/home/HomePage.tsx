import { useCallback, useState } from 'react';
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const toggleFlag = useToggleNarrativeFlag();
  const { narratives, tableStatus, refetch } = useRecentNarratives(RECENT_HOURS);

  const handleSelect = useCallback((narrative: Narrative) => {
    setSelectedId(narrative.narrativeId);
  }, []);
  const [, setSearchParams] = useSearchParams();

  return (
    <>
      <title>מסך ראשי · Palantir</title>
      <Box sx={pageStyles.areaTag}>{AREA_LABEL}</Box>
      <Typography component="h1" sx={pageStyles.title}>
        כל ההתראות
      </Typography>
      {/* Demo row trigger until the table component is plugged in */}
        <div style={{ marginBlockStart: '20px' }}>
          <button
            type="button"
            onClick={() => {
              setSearchParams({ narrativeId: 'nar-0001' });
            }}
            style={{
              padding: '10px 18px',
              backgroundColor: '#f2f2f2',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 500,
              fontFamily: 'inherit',
            }}
          >
            פתח פאנל התראה לדוגמה (עלייה חריגה בשיח סביב פעילות צהל בגבול הצפון)
          </button>
        </div>
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
