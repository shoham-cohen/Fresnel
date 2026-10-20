export const POSTGRES_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
} as const;

export type PostgresErrorCode =
  (typeof POSTGRES_ERROR_CODES)[keyof typeof POSTGRES_ERROR_CODES];
