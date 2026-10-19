import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EventStatus, Severity } from '../../../entities';
import { SERVITY } from '../consts';

// POST /api/events
export class CreateEventDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  narrativeId?: string;

  @IsOptional()
  @IsIn(Object.values(SERVITY))
  severity?: Severity = SERVITY.MEDIUM;

  @IsOptional()
  @IsBoolean()
  isSimulation?: boolean = false;

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

