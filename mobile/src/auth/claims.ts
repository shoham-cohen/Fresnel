// The signed-in user, read from the Keycloak access token. Display only: the server verifies the
// token and enforces every permission itself.

export type Arena = 'israel' | 'arab' | 'intl';

export type AuthUser = {
  /** `sub`: stable id, the user_id the server stores */
  id: string;
  /** `preferred_username`, e.g. dana.cohen */
  username: string;
  name: string | null;
  arenas: Arena[];
  roles: string[];
};

// Keycloak's `compartment` values → the arena codes of narrative.arena. Same map as the server
// (api/src/modules/mobile/auth/auth-user.ts). The international value is a guess until confirmed.
const COMPARTMENT_TO_ARENA: Record<string, Arena> = {
  israel: 'israel',
  arabic: 'arab',
  arab: 'arab',
  international: 'intl',
  intl: 'intl',
  world: 'intl',
};

export function compartmentsToArenas(compartment: unknown): Arena[] {
  const values = Array.isArray(compartment) ? compartment : typeof compartment === 'string' ? [compartment] : [];
  const arenas = values
    .filter((value): value is string => typeof value === 'string')
    .map((value) => COMPARTMENT_TO_ARENA[value.trim().toLowerCase()])
    .filter((arena): arena is Arena => arena !== undefined);
  return [...new Set(arenas)];
}

type Claims = {
  sub?: string;
  preferred_username?: string;
  name?: string;
  compartment?: unknown;
  resource_access?: Record<string, { roles?: unknown }>;
};

export function userFromAccessToken(accessToken: string, clientId: string): AuthUser {
  const claims = decodeJwtPayload(accessToken);
  const roles = claims.resource_access?.[clientId]?.roles;
  return {
    id: claims.sub ?? '',
    username: claims.preferred_username ?? claims.sub ?? '',
    name: claims.name ?? null,
    arenas: compartmentsToArenas(claims.compartment),
    roles: Array.isArray(roles) ? roles.filter((role): role is string => typeof role === 'string') : [],
  };
}

// The payload of a JWT, without verifying it (the server does). UTF-8 safe, for Hebrew names.
function decodeJwtPayload(token: string): Claims {
  const part = token.split('.')[1];
  if (!part) {
    throw new Error('access token is not a JWT');
  }
  const base64 = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=');
  const binary = atob(base64);
  const percentEncoded = Array.from(binary, (char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join('');
  return JSON.parse(decodeURIComponent(percentEncoded)) as Claims;
}
