import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Arena } from '../../../entities';


export class FetchedNarrativeDto {
  @IsString()
  narrativeId: string;

  @IsDateString()
  detectedAt: Date;

  @IsEnum(Arena)
  arena: Arena;

  @IsString()
  title: string;

  @IsString()
  summary: string;

  @IsBoolean()
  isAnomaly: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  itemCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  spreadRate?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  platformsCount?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  sharesCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  viewsCount?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

 @IsBoolean()
 isFlagged: boolean;

 @IsArray()
  embedding: number[];
}