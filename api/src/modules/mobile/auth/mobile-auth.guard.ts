import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { Arena } from '../../../entities';
import { AuthUser } from './auth-user';
import { InvalidTokenError, MobileTokenVerifier, SigningKeysUnavailableError } from './mobile-token.verifier';

export type AuthenticatedRequest = Request & { user?: AuthUser };

// The fixed user while MOBILE_AUTH_BYPASS=true (local development without Keycloak).
export const DEV_USER: AuthUser = {
  id: 'dev-mobile-user',
  username: 'dev.mobile',
  name: 'משתמש פיתוח',
  arenas: [Arena.IL, Arena.ARAB, Arena.INTL],
  roles: [],
};

// The mobile app's guard: a valid Keycloak access token of the mobile client → request.user.
// The web has its own guard (a different client and flow).
@Injectable()
export class MobileAuthGuard implements CanActivate {
  private readonly logger = new Logger(MobileAuthGuard.name);
  private readonly bypass: boolean;

  constructor(
    private readonly verifier: MobileTokenVerifier,
    config: ConfigService,
  ) {
    // Never in production, whatever the env says.
    this.bypass =
      config.get<string>('MOBILE_AUTH_BYPASS') === 'true' && config.get<string>('NODE_ENV') !== 'production';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = bearerToken(request.headers.authorization);

    if (!token) {
      if (this.bypass) {
        request.user = DEV_USER;
        return true;
      }
      throw new UnauthorizedException();
    }

    try {
      request.user = await this.verifier.verify(token);
      return true;
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        this.logger.debug(`rejected token: ${error.message}`);
        throw new UnauthorizedException();
      }
      if (error instanceof SigningKeysUnavailableError) {
        // Locally this is usually openport, or Node not trusting its certificate (NODE_EXTRA_CA_CERTS).
        this.logger.warn(`cannot fetch Keycloak signing keys: ${error.message}`);
        throw new ServiceUnavailableException('Keycloak is unreachable');
      }
      throw error;
    }
  }
}

function bearerToken(header: string | undefined): string | null {
  if (!header) return null;
  const [scheme, value] = header.split(' ');
  return scheme?.toLowerCase() === 'bearer' && value ? value : null;
}
