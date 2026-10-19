
import { useEffect, useState, type ReactNode } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useSearchParams } from 'react-router';
import { alpha, useTheme } from '@mui/material/styles';

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import SensorsIcon from '@mui/icons-material/Sensors';

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
  const colors = theme.palette;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: alpha(colors.primary.light, 0.35),
        border: `1px solid ${colors.primary.main}`,
        borderRadius: '5px',
        p: '12px 14px 16px',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ display: 'flex', color: colors.primary.main }}>
        {icon}
      </Box>

      <Typography
        sx={{
          textAlign: 'center',
          fontSize: '15px',
          color: colors.header.background,
          mt: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          textAlign: 'center',
          fontSize: '28px',
          fontWeight: 700,
          color: colors.header.background,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.1,
          mt: 0.5,
        }}
      >
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
          sx: {
            width: 420,
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100vh - 64px)',
            overflowY: 'auto',
            p: '24px 28px',
            bgcolor: colors.background.paper,
            color: colors.header.background,
            border: `1px solid ${colors.primary.main}`,
            direction: 'rtl',
            boxSizing: 'border-box',
            borderRadius: '8px',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton
          onClick={handleClose}
          aria-label="סגירה"
          size="small"
          sx={{
            color: colors.header.background,
            p: 0.5,
          }}
        >
          <CloseIcon fontSize="medium" />
        </IconButton>
      </Box>

      {isLoading && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          טוען נתונים...
        </Typography>
      )}

      {!isLoading && narrativeId && !displayData && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          לא נמצאו נתונים עבור הנרטיב
        </Typography>
      )}

      {displayData && (
        <Box sx={{ mt: 1.5 }}>
          <Typography
            sx={{
              fontSize: '24px',
              fontWeight: 700,
              lineHeight: 1.25,
              color: colors.header.background,
              mb: 0.5,
            }}
          >
            {displayData.title}
          </Typography>

          {displayData.summary && (
            <Typography
              sx={{
                fontSize: '16px',
                color: '#333',
                mb: 2,
              }}
            >
              {displayData.summary}
            </Typography>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 500,
                color: colors.header.background,
              }}
            >
              {displayData.arena?.join(', ') ?? '—'}
            </Typography>

            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 500,
                color: colors.header.background,
                direction: 'ltr',
              }}
            >
              {formatDetectedAt(displayData.detectedAt)}
            </Typography>
          </Box>

          <Divider
            sx={{
              my: 2,
              borderColor: alpha(colors.primary.main, 0.45),
            }}
          />

          <Typography
            sx={{
              fontSize: '19px',
              fontWeight: 700,
              color: colors.header.background,
              mb: 2,
            }}
          >
            נתונים מרכזיים
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 1.5,
              mb: 4,
            }}
          >
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
            sx={{
              width: '100%',
              minHeight: '56px',
              py: '12px',
              px: '20px',
              bgcolor: colors.header.background,
              color: colors.header.text,
              border: 0,
              borderRadius: '999px',
              fontSize: '19px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'background-color 0.15s',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                bgcolor: colors.primary.main,
              },
              '&:active': {
                bgcolor: colors.header.background,
              },
            }}
          >
            פתיחת אירוע
          </Box>
        </Box>
      )}
    </Dialog>
  );
}
