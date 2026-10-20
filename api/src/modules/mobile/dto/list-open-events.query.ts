import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

// GET /api/mobile/events?search=&page=1&pageSize=20
// No isSimulation: the mobile app shows real events only, so the server always asks for those.
export class ListOpenEventsQuery {
  // Free text, matched against the event title.
  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  // 1-based.
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
}
