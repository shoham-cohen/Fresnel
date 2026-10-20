import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_MOCK_API_URL = 'https://fresnel-mock-api.onrender.com';

interface MockRequest {
  method?: 'GET' | 'POST' | 'DELETE';
  path: string;
  mockUser?: string;
  body?: unknown;
}

// The only place in this module that calls fresnel-mock-api. 400, 403, 404 and 409 pass through to
// the app; any other failure of the mock is a 502.
@Injectable()
export class MockApiClient {
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    this.baseUrl = config.get<string>('MOCK_API_URL') ?? DEFAULT_MOCK_API_URL;
  }

  async request<T>({ method = 'GET', path, mockUser, body }: MockRequest): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json', 'X-Client': 'mobile' };
    if (mockUser) headers['X-Mock-User'] = mockUser;
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    }).catch(() => {
      throw new BadGatewayException('Mock API is unreachable');
    });

    if (!response.ok) throw toHttpException(response.status);

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }
}

function toHttpException(status: number): HttpException {
  switch (status) {
    case 400:
      return new BadRequestException();
    case 403:
      return new ForbiddenException();
    case 404:
      return new NotFoundException();
    case 409:
      return new ConflictException();
    default:
      return new BadGatewayException(`Mock API returned ${status}`);
  }
}
