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

export async function apiFetch<T>(path: string, { body, ...init }: ApiInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  headers.set('X-Client', 'mobile');
  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  if (config.mockUser) {
    headers.set('X-Mock-User', config.mockUser);
  }

  const response = await fetch(`${config.apiUrl}${path}`, {
    ...init,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  }).catch((error) => {
    throw new ApiError(0, 'Network request failed', { cause: error });
  });

  if (!response.ok) {
    throw new ApiError(response.status, `HTTP ${response.status}`);
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
