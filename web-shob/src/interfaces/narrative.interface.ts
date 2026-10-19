export interface Narrative {
  title: string;
  detectedAt: string;
  narrativeId: string;
  viewsCount: number;
  isFlagged: boolean;
  summary: string | null;
  arena: string[];
}

export interface NarrativeDetails extends Narrative {
  isAnomaly: boolean;
  itemList: string[];
  platforms: string[];
  languages: string[];
  sharesCount: number;
}
