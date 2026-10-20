import { useEffect, useState } from 'react'
import type { ActionType } from '../../../api/src/entities'
import { fetchActionTypes } from '../api/actionTypesApi'

type UseActionTypesResult = {
  actionTypes: ActionType[]
  loading: boolean
  error: string | null
}

export function useActionTypes(enabled: boolean = true): UseActionTypesResult {
  const [actionTypes, setActionTypes] = useState<ActionType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    const controller = new AbortController()

    setLoading(true)
    setError(null)

    fetchActionTypes(controller.signal)
      .then((data) => setActionTypes(data.filter((item) => item.active)))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'שגיאה בטעינת הנתונים')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [enabled])

  return { actionTypes, loading, error }
}