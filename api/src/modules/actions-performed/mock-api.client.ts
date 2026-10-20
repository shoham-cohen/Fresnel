import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_MOCK_API_URL = 'https://fresnel-mock-api.onrender.com';

// Who the mock acts as: the phone's Authorization header (the token from /api/mobile/auth), or,
// for testing with curl, X-Mock-User. Both are forwarded as is.
export interface MockCaller {
  authorization?: string;
  mockUser?: string;
}

interface MockRequest {
  method?: 'GET' | 'POST' | 'DELETE';
  path: string;
  caller: MockCaller;
  body?: unknown;
}

// The only place in this module that calls fresnel-mock-api. 400, 401, 403, 404 and 409 pass
// through to the app; any other failure of the mock is a 502.
@Injectable()
export class MockApiClient {
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    this.baseUrl = config.get<string>('MOCK_API_URL') ?? DEFAULT_MOCK_API_URL;
  }

  async request<T>({ method = 'GET', path, caller, body }: MockRequest): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json', 'X-Client': 'mobile' };
    if (caller.authorization) headers.Authorization = caller.authorization;
    if (caller.mockUser) headers['X-Mock-User'] = caller.mockUser;
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
    case 401:
      return new UnauthorizedException();
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
