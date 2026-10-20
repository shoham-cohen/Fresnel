import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export const ACTION_TYPE_CODES = [
  'official_response',
  'consultation',
  'reporter_contact',
  'external_contact',
  'field_collection',
  'source_analysis',
  'fact_check',
  'monitor',
  'other',
];

export class CreateEventActionDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(ACTION_TYPE_CODES)
  actionTypeCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  performedBy?: string;
}
