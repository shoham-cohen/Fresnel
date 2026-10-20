import { ConfigService } from '@nestjs/config';
import { createRemoteJWKSet, errors, jwtVerify, type JWTVerifyGetKey } from 'jose';
import { AuthUser, userFromClaims } from './auth-user';

const DEFAULT_ISSUER = 'https://keycloak.galileo.localhost/realms/galileo';

export class InvalidTokenError extends Error {}

// The realm's signing keys could not be fetched (openport down, DNS, untrusted certificate).
// Not the caller's fault, so the guard answers 503 and the app does not sign the user out.
export class SigningKeysUnavailableError extends Error {}

export interface MobileTokenVerifierOptions {
  issuer: string;
  /** The Keycloak client of the mobile app (KEYCLOAK_MOBILE_CLIENT_ID). */
  clientId: string;
  /** Signing keys. Defaults to the realm's JWKS. */
  keys?: JWTVerifyGetKey;
}

// Verifies a Keycloak access token issued to the mobile client (signature, issuer, expiry, client).
// Provided through a factory in MobileModule (fromConfig).
export class MobileTokenVerifier {
  private readonly issuer: string;
  private readonly clientId: string;
  private readonly keys: JWTVerifyGetKey;

  constructor(options: MobileTokenVerifierOptions) {
    this.issuer = options.issuer.replace(/\/$/, '');
    this.clientId = options.clientId;
    this.keys =
      options.keys ?? createRemoteJWKSet(new URL(`${this.issuer}/protocol/openid-connect/certs`));
  }

  static fromConfig(config: ConfigService): MobileTokenVerifier {
    return new MobileTokenVerifier({
      issuer: config.get<string>('KEYCLOAK_ISSUER') ?? DEFAULT_ISSUER,
      clientId: config.get<string>('KEYCLOAK_MOBILE_CLIENT_ID') ?? '',
    });
  }

  async verify(token: string): Promise<AuthUser> {
    if (!this.clientId) {
      throw new InvalidTokenError('KEYCLOAK_MOBILE_CLIENT_ID is not set');
    }

    let payload;
    try {
      ({ payload } = await jwtVerify(token, this.keys, {
        issuer: this.issuer,
        algorithms: ['RS256'],
      }));
    } catch (error) {
      if (error instanceof errors.JWKSTimeout || !(error instanceof errors.JOSEError)) {
        throw new SigningKeysUnavailableError(error instanceof Error ? error.message : String(error));
      }
      throw new InvalidTokenError(error.code);
    }

    // The token must be meant for the mobile client: in `aud` (Audience mapper) or as the authorized party.
    const audience = Array.isArray(payload.aud) ? payload.aud : payload.aud ? [payload.aud] : [];
    if (!audience.includes(this.clientId) && payload.azp !== this.clientId) {
      throw new InvalidTokenError('token was not issued for the mobile client');
    }
    if (!payload.sub) {
      throw new InvalidTokenError('token has no sub');
    }

    return userFromClaims(payload, this.clientId);
  }
}
