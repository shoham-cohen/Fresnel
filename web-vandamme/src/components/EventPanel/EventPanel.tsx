import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import EventCard from './EventCard';
import type { EventSummary, EventStatus } from '../../api/events';
import EventTimelineItem from './TimelineItems/EventTimelineItem';
import { Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import AddActionButton from '../layout/AddActionButton';
import { EventSourcesMonitor } from './EventSourcesMonitor';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));
type EventPanelProps = {
  selectedEvent?: EventSummary; 
};
    
export default function EventPanel( { selectedEvent }: EventPanelProps ) {

  const mockEventsList: EventSummary[] = [
    {
      eventId: 'שחר צברי',
      title: 'תיאום עם כתב',
      status: 'פתוח' as EventStatus,
      severity: 'high',
      createdAt: new Date().toISOString(),
    },
    {
      eventId: 'ישראל ישראלי',
      title: 'שיחה עם כתב לגבי פרסום הכתבה',
      status: 'בטיפול' as EventStatus,
      severity: 'high',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      eventId: 'ישראל ישראלי',
      title: 'שיחה עם כתב לגבי פרסום הכתבה',
      status: 'בטיפול' as EventStatus,
      severity: 'high',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      eventId: 'ישראל ישראלי',
      title: 'שיחה עם כתב לגבי פרסום הכתבה',
      status: 'בטיפול' as EventStatus,
      severity: 'high',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      eventId: 'ישראל ישראלי',
      title: 'שיחה עם כתב לגבי פרסום הכתבה',
      status: 'בטיפול' as EventStatus,
      severity: 'high',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      eventId: 'ישראל ישראלי',
      title: 'שיחה עם כתב לגבי פרסום הכתבה',
      status: 'בטיפול' as EventStatus,
      severity: 'high',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      eventId: 'ישראל ישראלי',
      title: 'שיחה עם כתב לגבי פרסום הכתבה',
      status: 'בטיפול' as EventStatus,
      severity: 'high',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      eventId: 'ישראל ישראלי',
      title: 'שיחה עם כתב לגבי פרסום הכתבה',
      status: 'בטיפול' as EventStatus,
      severity: 'high',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      eventId: 'ישראל ישראלי',
      title: 'שיחה עם כתב לגבי פרסום הכתבה',
      status: 'בטיפול' as EventStatus,
      severity: 'high',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      eventId: 'ישראל ישראלי',
      title: 'שיחה עם כתב לגבי פרסום הכתבה',
      status: 'בטיפול' as EventStatus,
      severity: 'high',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      eventId: 'ישראל ישראלי',
      title: 'שיחה עם כתב לגבי פרסום הכתבה',
      status: 'בטיפול' as EventStatus,
      severity: 'high',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },

  {
      eventId: 'ישראל ישראלי',
      title: 'שיחה עם כתב לגבי פרסום הכתבה',
      status: 'בטיפול' as EventStatus,
      severity: 'high',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      eventId: 'ישראל ישראלי',
      title: 'שיחה עם כתב לגבי פרסום הכתבה',
      status: 'בטיפול' as EventStatus,
      severity: 'high',
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      eventId: 'מערכת',
      title: 'עדכון סטטוס אוטומטי',
      status: 'סגור' as EventStatus,
      severity: 'high',
      createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    }
  ];

  return (
    <Grid
      container
      spacing={2}
      sx={{
        height: '100%',
        backgroundColor: '#ffff',
        width: '100%',
        m: 0,
        flexGrow: 1,
      }}
    >
      <Grid size={3} sx={{ height: '100%' }}>
        <Item>1</Item>
      </Grid>
      <Grid size={6} sx={{ height: '100%' }}>
         <Grid size={12} sx={{ height: '15%' }}>
        <EventCard selectedEvent={mockEventsList[0]}></EventCard>
      </Grid>
      <Grid size={12} sx={{ height: '85%',  paddingTop:3}}>
        <Typography variant="h5" sx={{ color: '#1B365D', fontWeight: 'bold' }}>
        פעולות שבוצעו ({mockEventsList.length})          </Typography>
        <Grid size={12} sx={{ height: '85%', paddingTop: 3, overflowY: 'auto' }}>
          {/* 3. Loop through the mockEventsList and render an item for each */}
          {mockEventsList.map((eventItem, index) => (<>
            <Divider component="li" />
              <EventTimelineItem 
              key={eventItem.eventId + index} 
              selectedAction={eventItem} ></EventTimelineItem>
              <Divider component="li" />
          </>
          ))}
        </Grid>
        <AddActionButton eventId={selectedEvent.eventId} />
      </Grid>
      </Grid>
      <Grid size={3} sx={{ height: '100%' }}>
        <Grid size={12} sx={{ height: '40%'  }}>
         <EventSourcesMonitor event={selectedEvent} />
      </Grid>
      <Grid size={12} sx={{ height: '60%', paddingTop:1}}>
        <Item>4</Item>
      </Grid>
      </Grid>
    </Grid>
  );
}
