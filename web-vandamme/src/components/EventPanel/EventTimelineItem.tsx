import { Box, Typography } from '@mui/material';
import type { EventSummary } from '../../api/events'; 

interface EventTimelineItemProps {
  selectedEvent?: EventSummary;
}

export default function EventTimelineItem({ selectedEvent }: EventTimelineItemProps) {
  // Early return if no event was passed to avoid runtime errors
  if (!selectedEvent) {
    return null;
  }

  // Safely format time
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
        gap: 2, 
        width: '100%', 
        fontFamily: 'sans-serif' 
      }}
    >
      {/* Timeline Graphic Area */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16px' }}>
        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', height: '100%' }}>
          {/* Vertical Track Line */}
          <Box sx={{ width: '2px', bgcolor: '#E2E8F0', height: '100%' }} />
          
          {/* Navy Blue Dot */}
          <Box
            sx={{
              position: 'absolute',
              top: '24px',
              width: '12px',
              height: '12px',
              bgcolor: '#1B365D',
              borderRadius: '50%',
            }}
          />
        </Box>
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          pb: 3,
        }}
      >
        {/* Top row: Time | Event ID */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, color: '#1B365D' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {formattedTime}
          </Typography>
          <Typography variant="body2" sx={{ color: '#D0D7E2' }}>
            |
          </Typography>
          <Typography variant="body2" sx={{ color: '#1B365D' }}>
            {selectedEvent.eventId}
          </Typography>
        </Box>

        {/* Middle row: Bold Title */}
        <Typography 
          variant="subtitle1" 
          sx={{ fontWeight: 'bold', color: '#1B365D', mb: 0.5 }} 
        >
          {selectedEvent.title}
        </Typography>

        {/* Bottom row: Status & Severity */}
        <Typography 
          variant="body2" 
          sx={{ color: '#1B365D' }} 
        >
          סטטוס: {selectedEvent.status} • חומרה: {selectedEvent.severity}
        </Typography>
      </Box>
    </Box>
  );
}