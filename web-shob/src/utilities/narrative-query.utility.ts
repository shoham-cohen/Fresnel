import { formatArenas } from '@/constants/arena.constant';
import type { Narrative } from '@/interfaces/narrative.interface';
import type { NarrativesQuery, Page } from '@/interfaces/narrative-api.interface';

/*
 * Applies a narratives query on the client: filter, sort (flagged first), then page.
 * TODO: GET /api/narratives returns every narrative and ignores query params. Once the server
 * filters, sorts and pages, send the query instead and delete this file.
 */

const collator = new Intl.Collator('he', { numeric: true, sensitivity: 'base' });

const matches = (narrative: Narrative, query: NarrativesQuery): boolean => {
  const search = query.search?.trim();
  const detectedAt = Date.parse(narrative.detectedAt);

  return (
    (!search || narrative.title.includes(search) || Boolean(narrative.summary?.includes(search))) &&
    (!query.from || detectedAt >= Date.parse(query.from)) &&
    (!query.to || detectedAt <= Date.parse(query.to)) &&
    (!query.arena || narrative.arena.includes(query.arena))
  );
};

const compare = (a: Narrative, b: Narrative, sortBy: NarrativesQuery['sortBy']): number => {
  switch (sortBy) {
    case 'arena':
      return collator.compare(formatArenas(a.arena), formatArenas(b.arena));
    case 'viewsCount':
      return a.viewsCount - b.viewsCount;
    default:
      return Date.parse(a.detectedAt) - Date.parse(b.detectedAt);
  }
};

export const applyNarrativesQuery = (
  narratives: readonly Narrative[],
  query: NarrativesQuery,
): Page<Narrative> => {
  const { page = 1, pageSize = 20, sortBy = 'detectedAt', sortDir = 'desc' } = query;
  const factor = sortDir === 'asc' ? 1 : -1;

  const filtered = narratives
    .filter((narrative) => matches(narrative, query))
    .sort((a, b) => {
      // Flagged narratives come first, across all pages; the sort applies within each group.
      const flagged = Number(b.isFlagged) - Number(a.isFlagged);
      if (flagged !== 0) return flagged;

      if (sortBy === 'arena') {
        const missing = Number(a.arena.length === 0) - Number(b.arena.length === 0);
        if (missing !== 0) return missing;
      }
      return factor * compare(a, b, sortBy);
    });

  return {
    page,
    pageSize,
    total: filtered.length,
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
  };
};
