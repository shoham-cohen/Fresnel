import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';

// GET /api/events?isSimulation=false&simulationId=uuid&search=&page=1&pageSize=20
export class ListEventsQuery {
  // Legacy boolean filter retained for compatibility.
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsOptional()
  @IsBoolean()
  isSimulation?: boolean;

  // Required, so a list never mixes real and simulation events.
  @Transform(({ value }) => (value === '' || value === 'null' ? null : value))
  @IsOptional()
  @IsUUID()
  simulationId?: string | null;

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
