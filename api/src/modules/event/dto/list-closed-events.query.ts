import { IsDateString, IsOptional } from 'class-validator';

export class ListClosedEventsQuery {
  @IsDateString()
  closed_after: string;

  @IsOptional()
  @IsDateString()
  closed_before?: string;
}
