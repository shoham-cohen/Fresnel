import { useEffect, useRef } from 'react'
import {
  Box,
  CircularProgress,
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
import type { EventSummary } from '../api/events'

type Props = {
  title: string
  events: EventSummary[]
  total: number
  loading: boolean
  error: boolean
  search: string
  onSearchChange: (search: string) => void
  hasMore: boolean
  onLoadMore: () => void
  selectedId: string | null
  onSelect: (id: string) => void
}

// "12:34" for today, "14/10" for earlier days
function formatOpenedAt(iso: string): string {
  const date = new Date(iso)
  const isToday = date.toDateString() === new Date().toDateString()
  return isToday
    ? date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' })
}

export default function ActiveEventList({
  title,
  events,
  total,
  loading,
  error,
  search,
  onSearchChange,
  hasMore,
  onLoadMore,
  selectedId,
  onSelect,
}: Props) {
  const listRef = useRef<HTMLUListElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  // Infinite scroll: load the next page when the end of the list comes into view.
  useEffect(() => {
    const end = endRef.current
    if (!end || !hasMore || loading || error) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore()
      },
      { root: listRef.current, rootMargin: '0px 0px 200px 0px' },
    )
    observer.observe(end)
    return () => observer.disconnect()
  }, [hasMore, loading, error, onLoadMore])

  return (
    <Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, pb: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          {title} ({total})
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="חיפוש לפי כותרת..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: loading && events.length === 0 && ( 
                <InputAdornment position="end">
                  <CircularProgress size={18} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      <Divider />
      <List ref={listRef} disablePadding sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>
        {events.map((event) => (
          <ListItemButton
            key={event.eventId}
            divider
            selected={event.eventId === selectedId}
            onClick={() => onSelect(event.eventId)}
            sx={{ py: 2 }}
          >
            <ListItemText primary={event.title} slotProps={{ primary: { sx: { fontWeight: 500 } } }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
              {formatOpenedAt(event.createdAt)}
            </Typography>
          </ListItemButton>
        ))}
        <div ref={endRef} />
        {loading && events.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={22} />
          </Box>
        )}
        {error && (
          <Typography sx={{ p: 3, textAlign: 'center', color: 'error.main' }}>שגיאה בטעינת האירועים</Typography>
        )}
        {!error && !loading && events.length === 0 && (
          <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>לא נמצאו אירועים</Typography>
        )}
      </List>
    </Paper>
  )
}
