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
  arena: Arena[];

  @IsBoolean()
  isAnomaly: boolean;

  // IDs of the items (post/article/video) that belong to this narrative.
  @IsOptional() 
  @IsArray()
  @IsString({ each: true })
  itemList: string[];

  @IsArray()
  @IsString({ each: true })
  platforms: string[];

  @IsNumber()
  sharesCount: number;

  @IsNumber()
  viewsCount: number;

  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @IsBoolean()
  isFlagged: boolean;

  @IsOptional()
  @IsArray()
  embedding: number[] | null;
}