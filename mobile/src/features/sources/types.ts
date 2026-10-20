// One item in GET /api/events/:id/items (CLAUDE.md, MAR-09).
export type SourceItem = {
  itemId: string;
  platform: string;
  url: string | null;
  title: string | null;
  contentText: string | null;
  authorName: string | null;
  sourceId: string | null;
  publishedAt: string;
};
