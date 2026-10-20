import type { ClosedEvent } from './ClosedEventsTable';
import { TableRow, TableCell, Typography, Box } from '@mui/material';
import WatchEventInfoButton from './WatchEventInfoButton';

interface TableItemProps {
  event: ClosedEvent;
}


export default function TableItem({ event } : TableItemProps) {
    return (
        <TableRow>
            <TableCell>
                <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                >
                    <Typography sx={{ fontSize: '0.9rem' }}>{event.closedAt}</Typography>
                    <Typography sx={{ color: '#7B8FB0', fontSize: '0.9rem' }}>|</Typography>
                    <Typography sx={{ fontSize: '0.9rem' }}>{event.closedAt}</Typography>
                </Box>
            </TableCell>

            <TableCell>
                <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                >
                    <Typography sx={{ fontSize: '17px' }}>{event.title}</Typography>
                </Box>
            </TableCell>

            <TableCell>
                <WatchEventInfoButton />
            </TableCell>
        </TableRow>
    )
}