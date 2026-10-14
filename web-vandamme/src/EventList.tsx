import { useState } from 'react'
import {
  Box,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import type { EventSummary } from './mockEvents'

type Props = {
  title: string
  events: EventSummary[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export default function EventList({ title, events, selectedId, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const visible = events.filter((event) => event.title.includes(query.trim()))

  return (
    <Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, pb: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          {title} ({events.length})
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="חיפוש לפי כותרת..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      <Divider />
      <List disablePadding sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>
        {visible.map((event) => (
          <ListItemButton
            key={event.id}
            divider
            selected={event.id === selectedId}
            onClick={() => onSelect(event.id)}
            sx={{ py: 2 }}
          >
            <ListItemText primary={event.title} slotProps={{ primary: { sx: { fontWeight: 500 } } }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
              {event.openedAt}
            </Typography>
          </ListItemButton>
        ))}
        {visible.length === 0 && (
          <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>לא נמצאו אירועים</Typography>
        )}
      </List>
    </Paper>
  )
}
