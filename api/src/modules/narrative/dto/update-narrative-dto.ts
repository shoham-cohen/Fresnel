import { IsBoolean, IsOptional } from 'class-validator';

// The body of PATCH /api/narratives/:id: the fields a client may change. Anything else is
// rejected by the global ValidationPipe (whitelist + forbidNonWhitelisted).
export class UpdateNarrativeDto {
  @IsOptional()
  @IsBoolean()
  isFlagged?: boolean;
}
