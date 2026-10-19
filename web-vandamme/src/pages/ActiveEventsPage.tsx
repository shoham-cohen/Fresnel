import { useState } from 'react'
import ActiveEventList from '../components/ActiveEventList'
import NoEventSelected from '../components/NoEventSelected'
import ListDetailLayout from '../components/layout/ListDetailLayout'
import { useActiveEvents } from '../hooks/useActiveEvents'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

type Props = {
  isSimulation: boolean
}

// VD-09: the open and in-progress events.
export default function ActiveEventsPage({ isSimulation }: Props) {
  // `search` is what is in the search box and changes on every keystroke.
  // `debouncedSearch` only catches up once the user stops typing for 300ms,
  // so typing "סרטון" sends one request to the server instead of five.
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const { events, total, loading, error, hasMore, loadMore } = useActiveEvents({ search: debouncedSearch, isSimulation })
const selectedEvent = events.find(
  (event) => String(event.eventId) === String(selectedEventId)
)

  return (
    <ListDetailLayout
      selectedEvent={selectedEvent}
      list={
        <ActiveEventList
          title="אירועים פתוחים"
          events={events}
          total={total}
          loading={loading}
          error={error}
          hasMore={hasMore}
          onLoadMore={loadMore}
          search={search}
          onSearchChange={setSearch}
          selectedId={selectedEventId}
          onSelect={setSelectedEventId}
        />
      }
    >
      {selectedEvent ? 
<></> : <NoEventSelected />}
    </ListDetailLayout>
  )
}
