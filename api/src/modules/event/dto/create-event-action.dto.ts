import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEventActionDto {
  @IsString()
  @IsNotEmpty()
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
