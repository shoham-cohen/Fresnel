import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Arena } from '../../../entities';

// Shape of the narrative payload sent by Anomalies / Doron.
export class FetchedNarrativeDto {
  @IsString()
  narrativeId: string;

  @IsDateString()
  detectedAt: Date;

  @IsOptional()
  @IsArray()
  @IsEnum(Arena, { each: true })
  arena: Arena[] | null;

  @IsBoolean()
  isAnomaly: boolean;

  // IDs of the items (post/article/video) that belong to this narrative.
  @IsOptional() 
  @IsArray()
  @IsString({ each: true })
  itemList: string[] | null;

  @IsArray()
  @IsString({ each: true })
  platforms: string[] | null;

  @IsNumber()
  sharesCount: number | null;

  @IsNumber()
  viewsCount: number | null;

  @IsArray()
  @IsString({ each: true })
  languages: string[] | null;

  @IsBoolean()
  isFlagged: boolean;

  @IsOptional()
  @IsArray()
  embedding: number[] | null;
}