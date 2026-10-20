import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import EventCard from './EventCard';
import type { EventSummary, EventStatus } from '../../api/events';
import EventTimelineItem from './TimelineItems/EventTimelineItem';

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

// Each action gets a stable unique id, used both as the React key and for deletion.
// When the real API returns an id for each action, use it instead of `uid`.
type ActionWithUid = EventSummary & { uid: string };

let uidCounter = 0;
const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60000).toISOString();

const makeMockAction = (overrides: Partial<EventSummary> = {}): ActionWithUid => ({
  uid: `action-${uidCounter++}`,
  eventId: 'ישראל ישראלי',
  title: 'שיחה עם כתב לגבי פרסום הכתבה',
  status: 'בטיפול' as EventStatus,
  severity: 'high',
  createdAt: minutesAgo(60),
  ...overrides,
});

const initialMockEvents: ActionWithUid[] = [
  makeMockAction({
    eventId: 'שחר צברי',
    title: 'תיאום עם כתב',
    status: 'פתוח' as EventStatus,
    createdAt: minutesAgo(0),
  }),
  makeMockAction({
    eventId: 'ישראל ישראלי',
    title: 'שיחה עם כתב לגבי פרסום הכתבה',
    createdAt: minutesAgo(20),
  }),
  makeMockAction({
    eventId: 'דנה כהן',
    title: 'שליחת תגובה רשמית לדוברות',
    createdAt: minutesAgo(45),
  }),
  makeMockAction({
    eventId: 'יוסי לוי',
    title: 'בדיקת פרטים מול גורם מקצועי',
    status: 'פתוח' as EventStatus,
    createdAt: minutesAgo(75),
  }),
  makeMockAction({
    eventId: 'מיכל אברהם',
    title: 'עדכון הנהלה על התפתחות האירוע',
    createdAt: minutesAgo(100),
  }),
  makeMockAction({
    eventId: 'מערכת',
    title: 'עדכון סטטוס אוטומטי',
    status: 'סגור' as EventStatus,
    createdAt: minutesAgo(120),
  }),
];

export default function EventPanel({ selectedEvent }: EventPanelProps) {
  const [eventsList, setEventsList] = useState<ActionWithUid[]>(initialMockEvents);

  // When connected to a real API, call it here first and then update the state.
  const handleDeleteAction = (uidToDelete: string) => {
    setEventsList((prev) => prev.filter((action) => action.uid !== uidToDelete));
  };

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
          <EventCard selectedEvent={selectedEvent ?? initialMockEvents[0]} />
        </Grid>

        <Grid size={12} sx={{ height: '85%', paddingTop: 3 }}>
          <Typography variant="h5" sx={{ color: '#1B365D', fontWeight: 'bold' }}>
            פעולות שבוצעו ({eventsList.length})
          </Typography>

          <Grid size={12} sx={{ height: '85%', paddingTop: 3, overflowY: 'auto' }}>
            {eventsList.map((eventItem) => (
              <React.Fragment key={eventItem.uid}>
                <Divider component="li" />
                <EventTimelineItem
                  selectedAction={eventItem}
                  onDelete={() => handleDeleteAction(eventItem.uid)}
                />
                <Divider component="li" />
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Grid size={3} sx={{ height: '100%' }}>
        <Grid size={12} sx={{ height: '40%' }}>
          <Item>3</Item>
        </Grid>
        <Grid size={12} sx={{ height: '60%', paddingTop: 1 }}>
          <Item>4</Item>
        </Grid>
      </Grid>
    </Grid>
  );
}