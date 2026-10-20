import { useEffect, useState, type ReactNode } from 'react';
import {
  Close as CloseIcon,
  ShareOutlined as ShareOutlinedIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  Sensors as SensorsIcon,
} from '@mui/icons-material';

import { Box, Divider, Drawer, IconButton, Typography } from '@mui/material';

import { useTheme } from '@mui/material/styles';
import { useSearchParams } from 'react-router';
import { getNarrativeDetailsPanelStyles } from './NarrativeDetailsPanel.styles';

import { CREATE_EVENT_URL, DETAILS_PANEL_TRANSITION } from './constants';
import { narrativeService } from '@/services/narrative.service';
import type { NarrativeDetails } from '@/interfaces/narrative.interface';

function formatDetectedAt(value: string): string {
  const d = new Date(value);

  if (Number.isNaN(d.getTime())) return value;

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = String(d.getFullYear());

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

interface MetricCardProps {
  label: string;
  value: number | null;
  icon: ReactNode;
}

function MetricCard({ label, value, icon }: MetricCardProps) {
  const theme = useTheme();
  const styles = getNarrativeDetailsPanelStyles(theme);

  return (
    <Box sx={styles.metricCard}>
      <Box sx={styles.metricIcon}>{icon}</Box>

      <Typography sx={styles.metricLabel}>{label}</Typography>

      <Typography sx={styles.metricValue}>
        {value == null ? '—' : value.toLocaleString('en-US')}
      </Typography>
    </Box>
  );
}

export function NarrativeDetailsPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const narrativeId = searchParams.get('narrativeId');
  //const simulationId = searchParams.get('simulationId');

  const [narrative, setNarrative] = useState<NarrativeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const styles = getNarrativeDetailsPanelStyles(theme);

  useEffect(() => {
    if (!narrativeId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    setIsLoading(true);
    setNarrative(null);

    void narrativeService
      .getById(narrativeId)
      .then((data) => {
        if (isMounted) {
          setNarrative(data);
        }
      })
      .catch((error: unknown) => {
        console.error('Failed to fetch narrative:', error);

        if (isMounted) {
          setNarrative(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [narrativeId]);

  const isOpen = Boolean(narrativeId);

  const handleClose = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('narrativeId');
      return next;
    });
  };

  const handleCreateEvent = () => {
    if (!displayData) return;

    const targetUrl =
      `${CREATE_EVENT_URL}?narrativeId=` + encodeURIComponent(displayData.narrativeId);
      //displayData.simulationId

    window.location.assign(targetUrl);
  };

  const displayData = narrativeId
    ? narrative?.narrativeId === narrativeId
      ? narrative
      : null
    : narrative;

  return (
    <Drawer
      open={isOpen}
      anchor="right"
      variant="persistent"
      transitionDuration={DETAILS_PANEL_TRANSITION.duration}
      slotProps={{
        transition: { easing: DETAILS_PANEL_TRANSITION.easing },
        paper: { component: 'aside', elevation: 4, 'aria-label': 'פרטי ההתראה', sx: styles.panel },
      }}
    >
      <Box sx={styles.closeButtonContainer}>
        <IconButton onClick={handleClose} aria-label="סגירה" size="small" sx={styles.closeButton}>
          <CloseIcon fontSize="medium" />
        </IconButton>
      </Box>

      {isLoading && <Typography sx={styles.statusMessage}>טוען נתונים...</Typography>}

      {!isLoading && narrativeId && !displayData && (
        <Typography sx={styles.statusMessage}>לא נמצאו נתונים עבור הנרטיב</Typography>
      )}

      {displayData && (
        <Box sx={styles.content}>
          <Typography sx={styles.title}>{displayData.title}</Typography>

          {displayData.summary && (
            <Typography sx={styles.summary}>{displayData.summary}</Typography>
          )}

          <Box sx={styles.metadata}>
            <Typography sx={styles.metadataText}>{displayData.arena.join(', ') || '—'}</Typography>

            <Typography sx={styles.detectedAt}>
              {formatDetectedAt(displayData.detectedAt)}
            </Typography>
          </Box>

          <Divider sx={styles.divider} />

          <Typography sx={styles.sectionTitle}>נתונים מרכזיים</Typography>

          <Box sx={styles.metricsGrid}>
            <MetricCard
              label="כמות פרסומים"
              value={displayData.itemList.length}
              icon={<DescriptionOutlinedIcon />}
            />

            <MetricCard
              label="כמות מקורות"
              value={displayData.platforms.length}
              icon={<SensorsIcon />}
            />

            <MetricCard
              label="סה״כ צפיות"
              value={displayData.viewsCount}
              icon={<VisibilityOutlinedIcon />}
            />

            <MetricCard
              label="כמות שיתופים"
              value={displayData.sharesCount}
              icon={<ShareOutlinedIcon />}
            />
          </Box>

          <Box
            component="button"
            type="button"
            onClick={handleCreateEvent}
            sx={styles.createEventButton}
          >
            פתיחת אירוע
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
