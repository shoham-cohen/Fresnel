// The phone's arenas, as in mobile/src/api/types.ts.
export type MobileArena = 'IL' | 'ARAB' | 'INTL';

export interface MobileUser {
  id: string; // the token's sub, the same id as performedBy on actions
  name: string;
  arenas: MobileArena[]; // empty: the user sees nothing
  roles: string[]; // e.g. editor, viewer, admin
}

// POST /api/mobile/auth. The phone sends accessToken as "Authorization: Bearer" on every call.
export interface MobileSession {
  accessToken: string;
  expiresIn: number; // seconds
  user: MobileUser;
}
