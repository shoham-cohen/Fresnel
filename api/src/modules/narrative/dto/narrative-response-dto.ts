import { Arena } from '../../../entities';

export class NarrativeResponseDto {
  narrativeId: string;
  title: string;
  summary?: string | null;
  isAnomaly: boolean;
  arena?: Arena[] | null;
  detectedAt: Date;
  itemList?: string[] | null;
  platforms?: string[] | null;
  sharesCount?: number | null;
  viewsCount?: number | null;
  languages?: string[] | null;
  isFlagged: boolean;
  embedding?: number[] | null;
  receivedAt?: Date | null;
  isEvent: boolean;
}
