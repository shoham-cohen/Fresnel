import {
  BadGatewayException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

// fresnel-mock-api: same routes and JSON as api/, with fake data. Used until the real sources are wired up.
export const MOCK_API_URL = 'https://fresnel-mock-api.onrender.com';

interface UpstreamRequest {
  method?: 'GET' | 'POST';
  // The phone's Authorization header, forwarded as is. The mock filters by the user in the token.
  authorization?: string;
}

// Call an upstream source. A 401, 403 or 404 passes through; any other failure of the source is a 502.
export async function getJson<T>(
  url: string,
  source: string,
  { method = 'GET', authorization }: UpstreamRequest = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json', 'X-Client': 'mobile' };
  if (authorization) headers.Authorization = authorization;

  let response: Response;
  try {
    response = await fetch(url, { method, headers });
  } catch {
    throw new BadGatewayException(`${source} is unreachable`);
  }

  if (response.status === 401) throw new UnauthorizedException();
  if (response.status === 404) throw new NotFoundException();
  if (response.status === 403) throw new ForbiddenException();
  if (!response.ok) throw new BadGatewayException(`${source} returned ${response.status}`);

  return (await response.json()) as T;
}
