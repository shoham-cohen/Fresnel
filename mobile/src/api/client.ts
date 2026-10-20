import { config } from '@/config';

/** status 0 means the request never reached the server (network error). */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'ApiError';
  }
}

type ApiInit = Omit<RequestInit, 'body'> & { body?: unknown };

// Set by AuthProvider on sign-in and sign-out. Sent as "Authorization: Bearer" on every call.
let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

/** Called when the server answers 401 to a signed-in call (the token expired), to sign out. */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

// Every call from the phone goes through here. The server writes X-Client to event_log.client.
export async function apiFetch<T>(path: string, { body, ...init }: ApiInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  headers.set('X-Client', 'mobile');
  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  const sentToken = accessToken;
  if (sentToken) {
    headers.set('Authorization', `Bearer ${sentToken}`);
  }

  const response = await fetch(`${config.apiUrl}${path}`, {
    ...init,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  }).catch((error) => {
    throw new ApiError(0, 'Network request failed', { cause: error });
  });

  if (!response.ok) {
    // Only when the token is still the current one: a late answer to a previous user's call
    // must not sign out the user who signed in since.
    if (response.status === 401 && sentToken && sentToken === accessToken) {
      onUnauthorized?.();
    }
    throw new ApiError(response.status, `HTTP ${response.status}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
