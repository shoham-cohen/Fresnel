import { IsString, IsUUID } from 'class-validator';

export class CreateSimulatedNarrativeDto {
  @IsString()
  narrativeId: string;

  @IsUUID()
  simulationId: string;
}
