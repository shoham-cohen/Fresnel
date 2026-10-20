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

type ApiAuth = {
  getAccessToken: () => Promise<string | null>;
  onUnauthorized: () => Promise<void>;
};

let auth: ApiAuth | null = null;

// Set by AuthProvider, so this module does not import React state.
export function configureApiAuth(next: ApiAuth) {
  auth = next;
}

// Every call from the phone goes through here. The server writes X-Client to event_log.client.
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = (await auth?.getAccessToken()) ?? null;

  const response = await fetch(`${config.apiUrl}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'X-Client': 'mobile',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  // The server rejected our token: the session is over, back to login.
  // Without a token (AUTH_BYPASS) a 401 only means the server is not in bypass mode too.
  if (response.status === 401 && token) {
    await auth?.onUnauthorized();
  }
  if (!response.ok) {
    throw new ApiError(response.status, `${init?.method ?? 'GET'} ${path} failed: ${response.status}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}
