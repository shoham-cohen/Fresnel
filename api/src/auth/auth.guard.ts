import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import type { AuthenticatedUser } from './authenticated-user';

const BEARER_PREFIX = 'Bearer ';

interface KeycloakPayload extends JWTPayload {
  name?: string;
  resource_access?: Record<string, { roles?: string[] } | undefined>;
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly issuer: string;
  private readonly audience: string;
  private readonly jwks: ReturnType<typeof createRemoteJWKSet>;

  constructor(config: ConfigService) {
    const url = config.get('KEYCLOAK_URL', 'https://keycloak.galileo.localhost');
    const realm = config.get('KEYCLOAK_REALM', 'galileo');

    this.issuer = `${url}/realms/${realm}`;
    this.audience = config.get('KEYCLOAK_AUDIENCE', 'mirage');
    this.jwks = createRemoteJWKSet(new URL(`${this.issuer}/protocol/openid-connect/certs`));
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
    const header = request.headers.authorization;

    if (!header?.startsWith(BEARER_PREFIX)) {
      throw new UnauthorizedException();
    }

    try {
      const { payload } = await jwtVerify<KeycloakPayload>(header.slice(BEARER_PREFIX.length), this.jwks, {
        issuer: this.issuer,
        audience: this.audience,
        algorithms: ['RS256'],
      });

      request.user = {
        id: payload.sub ?? '',
        name: payload.name,
        roles: payload.resource_access?.[this.audience]?.roles ?? [],
      };
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
