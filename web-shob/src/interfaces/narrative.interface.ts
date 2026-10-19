export interface Narrative {
  title: string;
  detectedAt: string;
  narrativeId: string;
  viewsCount: number;
  isFlagged: boolean;
  summary: string | null;
  locationName: string | null;
}
