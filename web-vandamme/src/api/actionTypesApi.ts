import type { ActionType } from '../../../api/src/entities'

const API_BASE_URL = '/api' 

export async function fetchActionTypes(
  signal?: AbortSignal
): Promise<ActionType[]> {
  const response = await fetch(`${API_BASE_URL}/action-types`, { signal })

  if (!response.ok) {
    throw new Error(`שגיאה בטעינת סוגי פעולות (${response.status})`)
  }

  return response.json()
}