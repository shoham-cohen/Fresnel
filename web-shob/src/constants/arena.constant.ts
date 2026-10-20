import type { Arena } from '@/interfaces/narrative-api.interface';

// Hebrew labels for the API's arena codes (the DB keeps English codes; labels live in the UI).
export const ARENA_LABELS: Record<Arena, string> = {
  israel: 'ישראל',
  arab: 'ערבי',
  intl: 'בינלאומי',
};

const isArena = (code: string): code is Arena => code in ARENA_LABELS;

/** "ישראל, ערבי" for ['israel', 'arab']. Unknown codes show as they are; no arena is ''. */
export const formatArenas = (arenas: readonly string[]): string => {
  return arenas.map((code) => (isArena(code) ? ARENA_LABELS[code] : code)).join(', ');
};
