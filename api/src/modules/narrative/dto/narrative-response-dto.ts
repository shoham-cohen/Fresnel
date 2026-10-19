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

export class NarrativeResponseDto {
  @IsString()
  narrativeId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  summary: string | null;

  @IsBoolean()
  isAnomaly: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(Arena, { each: true })
  arena: Arena[] | null;

  @IsDateString()
  detectedAt: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  itemList: string[] | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms: string[] | null;

  @IsOptional()
  @IsNumber()
  sharesCount: number | null;

  @IsOptional()
  @IsNumber()
  viewsCount: number | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages: string[] | null;

  @IsBoolean()
  isFlagged: boolean;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  embedding?: number[] | null;
}
