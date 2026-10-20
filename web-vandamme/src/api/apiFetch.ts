import { authToken } from '../auth/keycloak'

// fetch() with the Keycloak token. Use it for every request to the API.
export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = await authToken()
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  return fetch(input, { ...init, headers })
}
