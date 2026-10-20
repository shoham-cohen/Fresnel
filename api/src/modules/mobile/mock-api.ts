import { BadGatewayException, ForbiddenException, NotFoundException } from '@nestjs/common';

// fresnel-mock-api: same routes and JSON as api/, with fake data. Used until the real sources are wired up.
export const MOCK_API_URL = 'https://fresnel-mock-api.onrender.com';

// GET from an upstream source. A 404 or 403 passes through; any other failure of the source is a 502.
export async function getJson<T>(url: string, source: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/json', 'X-Client': 'mobile' } });
  } catch {
    throw new BadGatewayException(`${source} is unreachable`);
  }

  if (response.status === 404) throw new NotFoundException();
  if (response.status === 403) throw new ForbiddenException();
  if (!response.ok) throw new BadGatewayException(`${source} returned ${response.status}`);

  return (await response.json()) as T;
}
