import { Narrative } from '../../entities';
import { plainToInstance } from 'class-transformer';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NarrativeRepository } from './narrative.repository';
import { UpdateNarrativeDto } from './dto/update-narrative-dto';
import { NarrativeResponseDto } from './dto/narrative-response-dto';
import { NarrativeListPageDto } from './dto/narrative-list-page-dto';
import { FindNarrativesQueryDto } from './dto/find-narratives-query-dto';
import { ListNarrativesQueryDto } from './dto/list-narratives-query-dto';
import { CreateSimulatedNarrativeDto } from './dto/create-simulated-narrative-dto';
import { SimulatedNarrativeResponseDto } from './dto/simulated-narrative-response-dto';
import { SimulatedNarrativeListPageDto } from './dto/simulated-narrative-list-page-dto';

@Injectable()
export class NarrativeService {
  constructor(private readonly narrativeRepository: NarrativeRepository) {}

  private mapNarrativeToNarrativeResponseDto(narrative: Narrative): NarrativeResponseDto {
    const { events, ...data } = narrative;

    return plainToInstance(NarrativeResponseDto, {
      ...data,
      isEvent: Boolean(events && events.length > 0),
    });
  } 

  async findAll(
    query?: FindNarrativesQueryDto,
  ): Promise<NarrativeResponseDto[]> {
    const narratives = await this.narrativeRepository.findAll(query);

    return narratives.map(this.mapNarrativeToNarrativeResponseDto);
  }

  async findPage(query: ListNarrativesQueryDto): Promise<NarrativeListPageDto> {
    const [narratives, total] = await this.narrativeRepository.findPage(query);

    return {
      items: plainToInstance(
        NarrativeResponseDto,
        narratives.map((narrative) => {
          const { events, ...data } = narrative;
          return {
            ...data,
            isEvent: Boolean(events && events.length > 0),
          };
        }),
      ),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  async findOne(narrativeId: string): Promise<NarrativeResponseDto | null> {
    const narrative = await this.narrativeRepository.findOne(narrativeId);
    if (!narrative) return null;

    return this.mapNarrativeToNarrativeResponseDto(narrative);
  }

  async update(
    narrativeId: string,
    dto: UpdateNarrativeDto,
  ): Promise<NarrativeResponseDto> {
    const updated = await this.narrativeRepository.update(narrativeId, dto);

    if (!updated) {
      throw new NotFoundException(`Narrative with id ${narrativeId} not found`);
    }

    const { events, ...data } = updated;
    return plainToInstance(NarrativeResponseDto, {
      ...data,
      isEvent: Boolean(events && events.length > 0),
    });
  }

  async findSimulated(
    query?: FindNarrativesQueryDto,
  ): Promise<SimulatedNarrativeResponseDto[]> {
    const simulatedNarratives =
      await this.narrativeRepository.findSimulated(query);

    return plainToInstance(
      SimulatedNarrativeResponseDto,
      simulatedNarratives.map(({simulationId, narrative}) => {
        return {
          simulationId: simulationId,
          ...this.mapNarrativeToNarrativeResponseDto(narrative)
        };
      }),
    );
  }

  async findSimulatedPage(
    query: ListNarrativesQueryDto,
  ): Promise<SimulatedNarrativeListPageDto> {
    const [simulatedNarratives, total] =
      await this.narrativeRepository.findSimulatedPage(query);

    return {
      items: plainToInstance(
        SimulatedNarrativeResponseDto,
        simulatedNarratives.map(({ simulationId, narrative }) => {
          return {
            simulationId: simulationId,
            ...this.mapNarrativeToNarrativeResponseDto(narrative),
          };
        }),
      ),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  async findOneSimulated(
    simulationId: string,
  ): Promise<SimulatedNarrativeResponseDto | null> {
    const simulatedNarrative = await this.narrativeRepository.findOneSimulated(simulationId);

    if (!simulatedNarrative) {
      return null;
    }

    return plainToInstance(SimulatedNarrativeResponseDto, {
      simulationId: simulatedNarrative.simulationId,
      ...this.mapNarrativeToNarrativeResponseDto(simulatedNarrative.narrative)
    });
  }

  async createSimulated(
    dto: CreateSimulatedNarrativeDto,
  ): Promise<SimulatedNarrativeResponseDto> {
    const narrative = await this.narrativeRepository.findOne(dto.narrativeId);

    if (!narrative) {
      throw new NotFoundException(`Narrative with id ${dto.narrativeId} not found`);
    }

    const created = await this.narrativeRepository.createSimulated(dto);

    const { events, ...narrativeData } = narrative;
    return plainToInstance(SimulatedNarrativeResponseDto, {
      ...narrativeData,
      narrativeId: created.narrativeId,
      simulationId: created.simulationId,
      isEvent: Boolean(events && events.length > 0),
    });
  }
}

