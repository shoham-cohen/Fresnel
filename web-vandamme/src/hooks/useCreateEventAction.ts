import { useState } from 'react'
import { createEventAction } from '../api/eventActionsApi'
import type {
  CreateEventActionPayload,
  EventActionItem,
} from '../types/eventAction'

export function useCreateEventAction(eventId: string) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (
    payload: CreateEventActionPayload
  ): Promise<EventActionItem | null> => {
    setSubmitting(true)
    setError(null)

    try {
      return await createEventAction(eventId, payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בהוספת הפעולה')
      return null
    } finally {
      setSubmitting(false)
    }
  }

  const resetError = () => setError(null)

  return { submit, submitting, error, resetError }
}