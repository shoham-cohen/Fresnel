
import { useEffect, useState, type ReactNode } from 'react';
import {
  Close as CloseIcon,
  ShareOutlined as ShareOutlinedIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  Sensors as SensorsIcon,
} from '@mui/icons-material';

import {
  Box,
  Divider,
  Dialog,
  IconButton,
  Typography,
} from '@mui/material';

import { alpha, useTheme } from '@mui/material/styles';
import { useSearchParams } from 'react-router';
import { getNarrativeDetailsPanelStyles } from './NarrativeDetailsPanel.styles';

import {
  fetchNarrativeById,
  MOCK_CREATE_EVENT_URL,
  type NarrativeDetails,
} from './mockData';

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

      <Typography sx={styles.metricLabel}>
        {label}
      </Typography>

      <Typography sx={styles.metricValue}>
        {value == null ? '—' : value.toLocaleString('en-US')}
      </Typography>
    </Box>
  );
}

export function NarrativeDetailsPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const narrativeId = searchParams.get('narrativeId');

  const [narrative, setNarrative] =
    useState<NarrativeDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const colors = theme.palette;
  const styles = getNarrativeDetailsPanelStyles(theme);

  useEffect(() => {
    if (!narrativeId) {
      setNarrative(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    setIsLoading(true);
    setNarrative(null);

    void fetchNarrativeById(narrativeId)
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
      `${MOCK_CREATE_EVENT_URL}?narrativeId=` +
      encodeURIComponent(displayData.narrativeId);

    window.location.assign(targetUrl);
  };

  const displayData =
    narrativeId && narrative?.narrativeId === narrativeId
      ? narrative
      : null;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: styles.dialogPaper,
        },
      }}
    >
      <Box sx={styles.closeButtonContainer}>
        <IconButton
          onClick={handleClose}
          aria-label="סגירה"
          size="small"
          sx={styles.closeButton}
        >
          <CloseIcon fontSize="medium" />
        </IconButton>
      </Box>

      {isLoading && (
        <Typography sx={styles.statusMessage}>
          טוען נתונים...
        </Typography>
      )}

      {!isLoading && narrativeId && !displayData && (
        <Typography sx={styles.statusMessage}>
          לא נמצאו נתונים עבור הנרטיב
        </Typography>
      )}

      {displayData && (
        <Box sx={styles.content}>
          <Typography sx={styles.title}>
            {displayData.title}
          </Typography>

          {displayData.summary && (
            <Typography sx={styles.summary}>
              {displayData.summary}
            </Typography>
          )}

          <Box sx={styles.metadata}>
            <Typography sx={styles.metadataText}>
              {displayData.arena?.join(', ') ?? '—'}
            </Typography>

            <Typography sx={styles.detectedAt}>
              {formatDetectedAt(displayData.detectedAt)}
            </Typography>
          </Box>

          <Divider sx={styles.divider} />

          <Typography sx={styles.sectionTitle}>
            נתונים מרכזיים
          </Typography>

          <Box sx={styles.metricsGrid}>
            <MetricCard
              label="כמות פרסומים"
              value={displayData.itemList?.length ?? 0}
              icon={<DescriptionOutlinedIcon />}
            />

            <MetricCard
              label="כמות מקורות"
              value={displayData.platforms?.length ?? 0}
              icon={<SensorsIcon />}
            />

            <MetricCard
              label="סה״כ צפיות"
              value={displayData.viewsCount ?? 0}
              icon={<VisibilityOutlinedIcon />}
            />

            <MetricCard
              label="כמות שיתופים"
              value={displayData.sharesCount ?? 0}
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
    </Dialog>
  );
}
