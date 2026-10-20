import { apiFetch } from './apiFetch'
import type {
  CreateEventActionPayload,
  EventActionItem,
} from '../types/eventAction'

const API_BASE_URL = '/api'

export async function createEventAction(
  eventId: string,
  payload: CreateEventActionPayload
): Promise<EventActionItem> {
  const response = await apiFetch(`${API_BASE_URL}/events/${eventId}/actions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`שגיאה בהוספת הפעולה (${response.status})`)
  }

  return response.json()
}