import { config } from '@/config';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Every call from the phone goes through here. The server writes X-Client to event_log.client.
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${config.apiUrl}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'X-Client': 'mobile',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `${init?.method ?? 'GET'} ${path} failed: ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}
