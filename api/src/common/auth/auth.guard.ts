import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { createLocalJWKSet, errors, JWTPayload, jwtVerify } from 'jose';
import { AuthenticatedUser } from './authenticated-user';
import { KEYCLOAK_JWKS } from './keycloak-jwks';
import { Roles } from './roles.decorator';

interface KeycloakPayload extends JWTPayload {
  preferred_username?: string;
  name?: string;
  type?: string;
  compartment?: string[];
  resource_access?: Record<string, { roles?: string[] }>;
}

// Verifies the Keycloak access token (Authorization: Bearer <token>) and puts the user on request.user.
// Invalid or missing token → 401. Missing a role required by @Roles(...) → 403.
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly issuer: string;
  private readonly clientId: string;
  private readonly jwks: ReturnType<typeof createLocalJWKSet>;

  constructor(
    private readonly reflector: Reflector,
    configService: ConfigService,
  ) {
    this.issuer = `${configService.getOrThrow<string>('KEYCLOAK_URL')}/realms/${configService.getOrThrow<string>('KEYCLOAK_REALM')}`;
    this.clientId = configService.getOrThrow<string>('KEYCLOAK_CLIENT_ID');
    // Local copy of the realm keys: Node can't resolve *.localhost (only browsers do), so /certs is unreachable.
    this.jwks = createLocalJWKSet(KEYCLOAK_JWKS);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: AuthenticatedUser }>();
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }

    let payload: KeycloakPayload;
    try {
      ({ payload } = await jwtVerify<KeycloakPayload>(token, this.jwks, {
        issuer: this.issuer,
        audience: this.clientId,
        algorithms: ['RS256'],
      }));
    } catch (error) {
      // Anything that is not a token error (e.g. Keycloak unreachable) stays a 500.
      if (error instanceof errors.JOSEError) {
        throw new UnauthorizedException();
      }
      throw error;
    }

    const user: AuthenticatedUser = {
      id: payload.sub!,
      username: payload.preferred_username ?? '',
      fullName: payload.name ?? '',
      type: payload.type,
      compartments: payload.compartment ?? [],
      roles: payload.resource_access?.[this.clientId]?.roles ?? [],
    };
    request.user = user;

    const requiredRoles = this.reflector.getAllAndOverride(Roles, [context.getHandler(), context.getClass()]);
    if (requiredRoles?.length && !requiredRoles.some((role) => user.roles.includes(role))) {
      throw new ForbiddenException();
    }
    return true;
  }
}
