import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CloseEventDto {
  @IsDateString()
  closed_at: string;

  @IsString()
  @IsNotEmpty()
  closed_by: string;

  @IsString()
  @IsNotEmpty()
  closure_summary: string;
}
