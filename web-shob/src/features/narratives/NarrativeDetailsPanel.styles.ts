import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';

export const getNarrativeDetailsPanelStyles = (theme: Theme) => {
  const colors = theme.palette;

  return {
    metricCard: {
      display: 'flex',
      flexDirection: 'column',
      bgcolor: alpha(colors.primary.light, 0.35),
      border: `1px solid ${colors.primary.main}`,
      borderRadius: '5px',
      p: '12px 14px 16px',
      boxSizing: 'border-box',
    },

    metricIcon: {
      display: 'flex',
      color: colors.primary.main,
    },

    metricLabel: {
      textAlign: 'center',
      fontSize: '15px',
      color: colors.header.background,
      mt: 0.5,
    },

    metricValue: {
      textAlign: 'center',
      fontSize: '28px',
      fontWeight: 700,
      color: colors.header.background,
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1.1,
      mt: 0.5,
    },

    dialogPaper: {
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

    closeButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
    },

    closeButton: {
      color: colors.header.background,
      p: 0.5,
    },

    statusMessage: {
      mt: 2,
      textAlign: 'center',
    },

    content: {
      mt: 1.5,
    },

    title: {
      fontSize: '24px',
      fontWeight: 700,
      lineHeight: 1.25,
      color: colors.header.background,
      mb: 0.5,
    },

    summary: {
      fontSize: '16px',
      color: '#333',
      mb: 2,
    },

    metadata: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mb: 1.5,
    },

    metadataText: {
      fontSize: '18px',
      fontWeight: 500,
      color: colors.header.background,
    },

    detectedAt: {
      fontSize: '18px',
      fontWeight: 500,
      color: colors.header.background,
      direction: 'ltr',
    },

    divider: {
      my: 2,
      borderColor: alpha(colors.primary.main, 0.45),
    },

    sectionTitle: {
      fontSize: '19px',
      fontWeight: 700,
      color: colors.header.background,
      mb: 2,
    },

    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 1.5,
      mb: 4,
    },

    createEventButton: {
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
    },
  };
};
