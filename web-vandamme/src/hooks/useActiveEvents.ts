import { useCallback, useEffect, useState } from 'react'
import { fetchActiveEvents, type EventSummary } from '../api/events'

const PAGE_SIZE = 20

type Params = {
  search: string
  isSimulation: boolean
}

// Loads the active events page by page, for infinite scroll.
export function useActiveEvents({ search, isSimulation }: Params) {
  const [events, setEvents] = useState<EventSummary[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const loadPage = useCallback(
    async (pageToLoad: number) => {
      setLoading(true)
      setError(false)
      try {
        const data = await fetchActiveEvents({ isSimulation, search: search.trim(), page: pageToLoad, pageSize: PAGE_SIZE })
        // Page 1 replaces the list, the next pages are added to it.
        setEvents((prev) => (pageToLoad === 1 ? data.items : [...prev, ...data.items]))
        setTotal(data.total)
        setPage(pageToLoad)
      } catch (err) {
        console.error(err)
        setError(true)
      } finally {
        setLoading(false)
      }
    },
    [search, isSimulation],
  )

  // A new search starts again from page 1.
  useEffect(() => {
    // Loading data from the server is what this effect is for.
    // oxlint-disable-next-line react/set-state-in-effect
    loadPage(1)
  }, [loadPage])

  const hasMore = events.length < total

  const loadMore = () => {
    if (!loading && hasMore) loadPage(page + 1)
  }

  return { events, total, loading, error, hasMore, loadMore }
}
