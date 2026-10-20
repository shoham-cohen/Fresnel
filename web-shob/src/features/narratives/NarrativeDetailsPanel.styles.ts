import { alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { DETAILS_PANEL_WIDTH } from './constants';

const PANEL_MARGIN = 10;

export const getNarrativeDetailsPanelStyles = (theme: Theme) => {
  const colors = theme.palette;

  return {
    metricCard: {
      display: 'flex',
      flexDirection: 'column',
      bgcolor: alpha(colors.primary.light, 0.35),
      border: `1px solid ${colors.primary.main}`,
      borderRadius: '5px',
      p: '16px 16px 24px',
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
      mt: 1,
    },

    metricValue: {
      textAlign: 'center',
      fontSize: '28px',
      fontWeight: 700,
      color: colors.header.background,
      fontVariantNumeric: 'tabular-nums',
      lineHeight: 1.1,
      mt: 1.5,
    },

    panel: {
      width: DETAILS_PANEL_WIDTH,
      top: theme.customSizes.headerHeight,
      height: `calc(100% - ${String(theme.customSizes.headerHeight + PANEL_MARGIN * 2)}px)`,
      overflowY: 'auto',
      borderInlineStart: `1px solid ${colors.primary.light}`,
      p: '24px 28px',
      bgcolor: colors.background.paper,
      color: colors.header.background,
      boxSizing: 'border-box',
      borderRadius: '15px',
      m: `${String(PANEL_MARGIN)}px`,
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
      mt: 3,
    },

    title: {
      fontSize: '26px',
      fontWeight: 700,
      lineHeight: 1.25,
      color: colors.header.background,
      mb: 1,
      mt: 2,
    },

    summary: {
      fontSize: '18px',
      color: '#333',
      mb: 4,
    },

    metadata: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
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
      mb: 4,
      mt: 1,
      borderColor: alpha(colors.primary.main, 0.45),
    },

    sectionTitle: {
      fontSize: '19px',
      fontWeight: 700,
      color: colors.header.background,
      mb: 3,
    },

    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 2.5,
      mb: 6,
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
