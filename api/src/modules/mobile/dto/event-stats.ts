// GET /api/mobile/events/:id/stats. posts counts every item; the sums are over the 100 latest
// (basedOn says how many). A field with no data is null, never 0.
export interface EventStats {
  posts: number;
  views: number | null;
  shares: number | null;
  comments: number | null;
  topSources: { platform: string; count: number }[];
  basedOn: number;
  asOf: string;
}
