import { IsNotEmpty, IsString } from 'class-validator';

// POST /api/actions-performed/events/:eventId/close
export class CloseEventDto {
  @IsString()
  @IsNotEmpty()
  closureSummary: string;
}
