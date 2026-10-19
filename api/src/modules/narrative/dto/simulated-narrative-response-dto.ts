import { IsUUID } from 'class-validator';
import { NarrativeResponseDto } from './narrative-response-dto';

export class SimulatedNarrativeResponseDto extends NarrativeResponseDto {
  @IsUUID()
  simulationId: string;
}
