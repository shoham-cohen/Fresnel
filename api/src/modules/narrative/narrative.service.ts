import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateSimulatedNarrativeDto } from './dto/create-simulated-narrative-dto';
import { NarrativeResponseDto } from './dto/narrative-response-dto';
import { SimulatedNarrativeResponseDto } from './dto/simulated-narrative-response-dto';
import { NarrativeRepository } from './narrative.repository';

@Injectable()
export class NarrativeService {
  constructor(private readonly narrativeRepository: NarrativeRepository) {}

  async findAll(): Promise<NarrativeResponseDto[]> {
    const narratives = await this.narrativeRepository.findAll();
    return plainToInstance(NarrativeResponseDto, narratives);
  }

  async findOne(narrativeId: string): Promise<NarrativeResponseDto | null> {
    const narrative = await this.narrativeRepository.findOne(narrativeId);
    return narrative ? plainToInstance(NarrativeResponseDto, narrative) : null;
  }

  async findSimulated(
    simulationId?: string,
  ): Promise<SimulatedNarrativeResponseDto[]> {
    const simulatedNarratives =
      await this.narrativeRepository.findSimulated(simulationId);

    return plainToInstance(
      SimulatedNarrativeResponseDto,
      simulatedNarratives.map((item) => ({
        ...item.narrative,
        narrativeId: item.narrativeId,
        simulationId: item.simulationId,
      })),
    );
  }

  async createSimulated(
    dto: CreateSimulatedNarrativeDto,
  ): Promise<SimulatedNarrativeResponseDto> {
    const narrative = await this.narrativeRepository.findOne(dto.narrativeId);

    if (!narrative) {
      throw new NotFoundException(`Narrative with id ${dto.narrativeId} not found`);
    }

    const created = await this.narrativeRepository.createSimulated(dto);
    
    return plainToInstance(SimulatedNarrativeResponseDto, {
      ...narrative,
      narrativeId: created.narrativeId,
      simulationId: created.simulationId,
    });
  }
}

