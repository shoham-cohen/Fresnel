import { useEffect, useState, type ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SensorsIcon from '@mui/icons-material/Sensors';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useSearchParams } from 'react-router';

import {
  fetchNarrativeById,
  MOCK_CREATE_EVENT_URL,
  type NarrativeDetails,
} from './mockData';

// Formats ISO timestamp (from DB entity `detected_at`) to "HH:mm dd/MM/yyyy"
function formatDetectedAt(value: string): string {
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear());
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  } catch {
    return value;
  }
}

interface MetricCardProps {
  label: string;
  value: number;
  icon: ReactNode;
}

function MetricCard({ label, value, icon }: MetricCardProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f2f2f2',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        p: '12px 14px 16px',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', color: '#111' }}>
        {icon}
      </Box>
      <Typography sx={{ textAlign: 'center', fontSize: '15px', color: '#333', mt: 0.5 }}>
        {label}
      </Typography>
      <Typography
        sx={{
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: 700,
          color: '#000',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.1,
          mt: 0.5,
        }}
      >
        {value.toLocaleString('en-US')}
      </Typography>
    </Box>
  );
}

export function NarrativeDetailsPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const narrativeId = searchParams.get('narrativeId');
  const [narrative, setNarrative] = useState<NarrativeDetails | null>(null);

  useEffect(() => {
    if (!narrativeId) {
      return;
    }

    let isMounted = true;
    void fetchNarrativeById(narrativeId).then((data) => {
      if (isMounted) {
        setNarrative(data);
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
    if (!narrative) return;
    const targetUrl = `${MOCK_CREATE_EVENT_URL}?narrativeId=${encodeURIComponent(narrative.narrativeId)}`;
    console.info('Redirecting to create event:', targetUrl);
    window.location.assign(targetUrl);
  };

  const displayData = narrativeId && narrative?.narrativeId === narrativeId ? narrative : null;

  return (
    <Dialog
      open={isOpen}
  onClose={handleClose}
  maxWidth={false}
  slotProps={{
    paper: {
      sx: {
        width: 420,
        maxWidth: 'calc(100vw - 32px)',
        maxHeight: 'calc(100vh - 64px)',
        overflowY: 'auto',
        p: '24px 28px',
        bgcolor: '#ffffff',
        direction: 'rtl',
        boxSizing: 'border-box',
        borderRadius: '12px',
      },
    },
  }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton
          onClick={handleClose}
          aria-label="סגירה"
          size="small"
          sx={{ color: '#000', p: 0.5 }}
        >
          <CloseIcon fontSize="medium" />
        </IconButton>
      </Box>

      {displayData && (
        <Box sx={{ mt: 1.5 }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 700, lineHeight: 1.25, color: '#000', mb: 0.5 }}>
            {displayData.title}
          </Typography>

          {displayData.summary && (
            <Typography sx={{ fontSize: '16px', color: '#333', mb: 2 }}>
              {displayData.summary}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ fontSize: '18px', fontWeight: 500, color: '#000' }}>
              {displayData.locationName ?? '—'}
            </Typography>
            <Typography sx={{ fontSize: '18px', fontWeight: 500, color: '#000', direction: 'ltr' }}>
              {formatDetectedAt(displayData.detectedAt)}
            </Typography>
          </Box>

          <Divider sx={{ my: 2, borderColor: '#d9d9d9' }} />

          <Typography sx={{ fontSize: '19px', fontWeight: 700, color: '#000', mb: 2 }}>
            נתונים מרכזיים
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5, mb: 4 }}>
            <MetricCard
              label="כמות פרסומים"
              value={displayData.metrics.publications}
              icon={<DescriptionOutlinedIcon />}
            />

            <MetricCard
              label="כמות מקורות"
              value={displayData.metrics.sources}
              icon={<SensorsIcon />}
            />

            <MetricCard
              label="סה״כ צפיות"
              value={displayData.metrics.views}
              icon={<VisibilityOutlinedIcon />}
            />

            <MetricCard
              label="כמות שיתופים"
              value={displayData.metrics.shares}
              icon={<ShareOutlinedIcon />}
            />
          </Box>

          <Box
            component="button"
            type="button"
            onClick={handleCreateEvent}
            sx={{
              width: '100%',
              minHeight: '48px',
              py: '12px',
              px: '20px',
              bgcolor: '#d9d9d9',
              color: '#000',
              border: 0,
              borderRadius: '6px',
              fontSize: '19px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background-color 0.15s',
              '&:hover': { bgcolor: '#cccccc' },
              '&:active': { bgcolor: '#bebebe' },
            }}
          >
            פתיחת אירוע
          </Box>
        </Box>
      )}
    </Dialog>
  );
}
