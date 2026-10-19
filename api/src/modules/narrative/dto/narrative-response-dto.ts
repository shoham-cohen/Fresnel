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
  @IsEnum(Arena)
  arena: Arena | null;

  @IsDateString()
  detectedAt: Date;

  @IsDateString()
  receivedAt: Date;

  @IsBoolean()
  isEvent: boolean;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  embedding?: number[] | null;
}
