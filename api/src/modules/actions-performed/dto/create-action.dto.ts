import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

// POST /api/actions-performed/events/:eventId/actions
export class CreateActionDto {
  @IsString()
  @IsNotEmpty()
  actionType: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;
}

export interface CreatedAction {
  actionId: string;
  eventId: string;
  actionType: string;
  title: string;
  description: string | null;
  performedBy: string;
  performedAt: string;
  updatedAt: string;
}
