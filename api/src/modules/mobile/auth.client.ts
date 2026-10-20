import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MobileArena, MobileSession } from './dto/mobile-session';
import { getJson, MOCK_API_URL } from './mock-api';

// The Keycloak-shaped claims the mock signs into its token.
interface MockClaims {
  sub: string;
  name?: string;
  preferred_username?: string;
  compartment?: string[];
  resource_access?: Record<string, { roles?: string[] }>;
}

interface MockAuthResponse {
  accessToken: string;
  expiresIn: number;
  claims: MockClaims;
}

const ARENA_BY_COMPARTMENT: Record<string, MobileArena> = {
  israel: 'IL',
  arabic: 'ARAB',
  international: 'INTL',
};

// The client the mock puts the app roles under.
const ROLES_CLIENT = 'vandamobile';

// Until the Miraj login lands: every sign-in gets a token for a random mock user, each with its
// own arenas and roles. The mock then filters every call by the user in that token.
@Injectable()
export class AuthClient {
  private readonly baseUrl: string;

  constructor(config: ConfigService) {
    this.baseUrl = config.get<string>('MOCK_API_URL') ?? MOCK_API_URL;
  }

  // excludeUserId: the user who just signed out, so the next sign-in is always someone else.
  async signIn(excludeUserId?: string): Promise<MobileSession> {
    const params = new URLSearchParams();
    if (excludeUserId) {
      const users = await getJson<{ sub: string }[]>(
        `${this.baseUrl}/api/mobile/auth/users`,
        'Auth source',
      );
      const others = users.filter((user) => user.sub !== excludeUserId);
      if (others.length > 0) {
        params.set('user', others[Math.floor(Math.random() * others.length)].sub);
      }
    }

    const { accessToken, expiresIn, claims } = await getJson<MockAuthResponse>(
      `${this.baseUrl}/api/mobile/auth?${params}`,
      'Auth source',
      { method: 'POST' },
    );

    return {
      accessToken,
      expiresIn,
      user: {
        id: claims.sub,
        name: claims.name ?? claims.preferred_username ?? claims.sub,
        arenas: (claims.compartment ?? [])
          .map((compartment) => ARENA_BY_COMPARTMENT[compartment])
          .filter((arena): arena is MobileArena => arena !== undefined),
        roles: claims.resource_access?.[ROLES_CLIENT]?.roles ?? [],
      },
    };
  }
}
