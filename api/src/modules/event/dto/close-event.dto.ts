import { IsNotEmpty, IsString } from 'class-validator';

export class CloseEventDto {
  @IsString()
  @IsNotEmpty()
  closedBy: string;

  @IsString()
  @IsNotEmpty()
  closureSummary: string;
}
