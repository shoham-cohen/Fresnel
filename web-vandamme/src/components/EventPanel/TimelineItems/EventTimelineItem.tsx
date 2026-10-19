import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { EventSummary } from '../../../api/events';

interface EventTimelineItemProps {
  selectedEvent?: EventSummary;
}

export default function EventTimelineItem({ selectedEvent }: EventTimelineItemProps) {
  if (!selectedEvent) {
    return null;
  }

  const formattedTime = selectedEvent.createdAt
    ? new Date(selectedEvent.createdAt).toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '--:--';

  return (
    <Box
      dir="rtl"
      sx={{
        display: 'flex',
        gap: 3,
        width: '100%',
        fontFamily: 'sans-serif',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', height: '100%' }}>
          <Box sx={{ width: '3px', bgcolor: '#E2E8F0', height: '100%' }} />
          <Box
            sx={{
              position: 'absolute',
              top: '28px',
              width: '16px',
              height: '16px',
              bgcolor: '#1B365D',
              borderRadius: '50%',
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, color: '#1B365D' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            {formattedTime}
          </Typography>
          <Typography sx={{ color: '#D0D7E2', fontSize: '1.1rem' }}>
            |
          </Typography>
          <Typography sx={{ color: '#1B365D', fontSize: '1.1rem' }}>
            {selectedEvent.eventId}
          </Typography>
        </Box>

        <Typography
          variant="h6"
          sx={{ 
            fontWeight: 'bold', 
            color: '#1B365D', 
            mb: 1, 
            fontSize: '1.3rem',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.2)'
          }}
        >
          {selectedEvent.title}
        </Typography>

        <Typography
          sx={{ color: '#1B365D', fontSize: '1.1rem' }}
        >
          סטטוס: {selectedEvent.status} • חומרה: {selectedEvent.severity}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', pt: 2, pl: 2 }}>
        <IconButton aria-label="delete event" size="large" sx={{ color: '#94a3b8' }}>
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </Box>
    </Box>
  );
}