import {
  Min,
  Max,
  IsIn,
  IsInt,
  IsEnum,
  IsString,
  MaxLength,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Arena } from '../../../entities';

export const NARRATIVE_SORT_FIELDS = ['arena', 'detectedAt', 'viewsCount'] as const;
export type NarrativeSortField = (typeof NARRATIVE_SORT_FIELDS)[number];

export class ListNarrativesQueryDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @IsEnum(Arena)
  arena?: Arena;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 20;

  @IsOptional()
  @IsIn(NARRATIVE_SORT_FIELDS)
  sortBy: NarrativeSortField = 'detectedAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir: 'asc' | 'desc' = 'desc';
}
