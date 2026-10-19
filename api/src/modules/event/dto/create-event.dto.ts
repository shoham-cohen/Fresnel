import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EventStatus, Severity } from '../../../entities';

// POST /api/events
export class CreateEventDto {
  // Required: narrative id (standard JSON camelCase).
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  narrativeId?: string;

  // Defaults to 'medium' if omitted.
  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'critical'])
  severity?: Severity = 'medium';

  // True for simulation events ("תרגילית"), defaults to false.
  @IsOptional()
  @IsBoolean()
  isSimulation?: boolean = false;

  // User id opening the event. Defaults to 'shob.operator' if not provided.
  @IsOptional()
  @IsString()
  createdBy?: string;
}

export interface CreatedEventResponse {
  eventId: string;
  narrativeId: string;
  title: string;
  status: EventStatus;
  severity: Severity;
  isSimulation: boolean;
  createdBy: string;
  createdAt: Date;
}

