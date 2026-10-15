import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

// GET /api/events?isSimulation=false&search=&page=1&pageSize=20
export class ListEventsQuery {
  // Required, so a list never mixes real and simulation events.
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsBoolean()
  isSimulation: boolean;

  // Free text, matched against the narrative title.
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
