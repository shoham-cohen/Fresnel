import { Arena } from '../../../entities';

export class NarrativeResponseDto {
  narrativeId: string;
  title: string;
  summary: string;
  isAnomaly: boolean;
  arena: Arena[];
  detectedAt: Date;
  itemList: string[];
  platforms: string[];
  sharesCount: number;
  viewsCount: number;
  languages: string[];
  isFlagged: boolean;
  embedding?: number[];
  receivedAt: Date;
  isEvent: boolean;
}
