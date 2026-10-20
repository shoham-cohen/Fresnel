import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import TableItem from './TableItem';

export interface ClosedEvent {
  id: string;
  title: string;
  closedAt: string; // ISO string
}

const eventTitles = [
  'תיאום עם כתב',
  'שיחה עם כתב לגבי פרסום הכתבה',
  'שליחת תגובה רשמית לדוברות',
  'בדיקת פרטים מול גורם מקצועי',
  'עדכון הנהלה על התפתחות האירוע',
];

// Mock data. Replace with real data from the API when it's ready.
const mockClosedEvents: ClosedEvent[] = Array.from({ length: 20 }, (_, i) => ({
  id: `closed-${i}`,
  title: eventTitles[i % eventTitles.length],
  closedAt: new Date(2026, 3, 10 - (i % 7), 14, 32 - (i % 30)).toISOString(),
}));

export default function ClosedEventsTable() {
  return (
    <TableContainer
      sx={{
        flexGrow: 1,
        minHeight: 0,
        borderRadius: 2,
        // Thin light-blue scrollbar, as in the design
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { backgroundColor: '#EAF0F9' },
        '&::-webkit-scrollbar-thumb': { backgroundColor: '#C3D1E8', borderRadius: '4px' },
      }}
    >
      <Table stickyHeader dir="rtl">
        <TableHead
          sx={{
            '& .MuiTableCell-head': {
              backgroundColor: '#DDE4EE',
              color: '#1B365D',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              borderBottom: 'none',
              py: 1.5,
            },
          }}
        >
          <TableRow>
            <TableCell sx={{ width: '28%' }}>תאריך ושעה</TableCell>
            <TableCell>כותרת האירוע</TableCell>
            <TableCell sx={{ width: '18%' }} />
          </TableRow>
        </TableHead>

        <TableBody>
          {mockClosedEvents.map((event) => (
            <TableItem key={event.id} event={event} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}