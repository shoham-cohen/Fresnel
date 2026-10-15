export type EventStatus = 'open' | 'in_progress' | 'closed'
export type Severity = 'low' | 'medium' | 'high' | 'critical'

export type EventSummary = {
  eventId: string
  title: string
  status: EventStatus
  severity: Severity
  createdAt: string
}

export type EventListPage = {
  items: EventSummary[]
  total: number // all matching events, across pages
  page: number
  pageSize: number
}

type ActiveEventsParams = {
  isSimulation: boolean
  search?: string
  page: number // 1-based
  pageSize: number
}

export async function fetchActiveEvents(
  { isSimulation, search, page, pageSize }: ActiveEventsParams,
  signal?: AbortSignal,
): Promise<EventListPage> {
  const params = new URLSearchParams({
    isSimulation: String(isSimulation),
    page: String(page),
    pageSize: String(pageSize),
  })
  if (search) params.set('search', search)

  const res = await fetch(`/api/events?${params}`, { signal })
  if (!res.ok) throw new Error(`GET /api/events failed: ${res.status}`)
  return res.json()
}
