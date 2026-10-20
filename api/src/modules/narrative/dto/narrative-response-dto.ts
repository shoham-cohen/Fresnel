import { Type } from 'class-transformer';
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

  @Type(() => Number)
  sharesCount: number;

  @Type(() => Number)
  viewsCount: number;

  languages: string[];
  isFlagged: boolean;
  embedding?: number[];
  receivedAt: Date;
  isEvent: boolean;
  simulationId?: string | null;
}
