import type { JWTPayload } from 'jose';
import { Arena } from '../../../entities';

// The signed-in user of the mobile app, built from the Keycloak access token.
export interface AuthUser {
  /** `sub`: stable id. The key in device_token.user_id. */
  id: string;
  /** `preferred_username`, e.g. dana.cohen */
  username: string;
  /** `name`, for display */
  name: string | null;
  /** From `compartment`. Only arenas we know; an unknown value is dropped. */
  arenas: Arena[];
  /** `resource_access[<mobile client>].roles` */
  roles: string[];
}

// Keycloak's `compartment` values → our Arena codes (narrative.arena, device_token.arenas).
// Only `israel` and `arabic` were seen so far; the international value is a guess until Keycloak confirms.
const COMPARTMENT_TO_ARENA: Record<string, Arena> = {
  israel: Arena.IL,
  arabic: Arena.ARAB,
  arab: Arena.ARAB,
  international: Arena.INTL,
  intl: Arena.INTL,
  world: Arena.INTL,
};

export function compartmentsToArenas(compartment: unknown): Arena[] {
  const values = Array.isArray(compartment) ? compartment : typeof compartment === 'string' ? [compartment] : [];
  const arenas = values
    .filter((value): value is string => typeof value === 'string')
    .map((value) => COMPARTMENT_TO_ARENA[value.trim().toLowerCase()])
    .filter((arena): arena is Arena => arena !== undefined);
  return [...new Set(arenas)];
}

interface KeycloakClaims extends JWTPayload {
  preferred_username?: string;
  name?: string;
  compartment?: unknown;
  resource_access?: Record<string, { roles?: unknown }>;
}

export function userFromClaims(payload: JWTPayload, clientId: string): AuthUser {
  const claims = payload as KeycloakClaims;
  const roles = claims.resource_access?.[clientId]?.roles;
  return {
    id: claims.sub ?? '',
    username: claims.preferred_username ?? claims.sub ?? '',
    name: claims.name ?? null,
    arenas: compartmentsToArenas(claims.compartment),
    roles: Array.isArray(roles) ? roles.filter((role): role is string => typeof role === 'string') : [],
  };
}
