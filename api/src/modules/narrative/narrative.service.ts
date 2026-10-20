import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateSimulatedNarrativeDto } from './dto/create-simulated-narrative-dto';
import { NarrativeResponseDto } from './dto/narrative-response-dto';
import { SimulatedNarrativeResponseDto } from './dto/simulated-narrative-response-dto';
import { UpdateNarrativeDto } from './dto/update-narrative-dto';
import { ListNarrativesQueryDto } from './dto/list-narratives-query-dto';
import { NarrativeListPageDto } from './dto/narrative-list-page-dto';
import { NarrativeRepository } from './narrative.repository';

@Injectable()
export class NarrativeService {
  constructor(private readonly narrativeRepository: NarrativeRepository) {}

  async findAll(): Promise<NarrativeResponseDto[]> {
    const narratives = await this.narrativeRepository.findAll();

    return plainToInstance(
      NarrativeResponseDto,
      narratives.map((narrative) => {
        const { events, ...data } = narrative;
        return {
          ...data,
          isEvent: Boolean(events && events.length > 0),
        };
      }),
    );
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

    const { events, ...data } = narrative;
    return plainToInstance(NarrativeResponseDto, {
      ...data,
      isEvent: Boolean(events && events.length > 0),
    });
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
    simulationId?: string,
  ): Promise<SimulatedNarrativeResponseDto[]> {
    const simulatedNarratives =
      await this.narrativeRepository.findSimulated(simulationId);

    return plainToInstance(
      SimulatedNarrativeResponseDto,
      simulatedNarratives.map((item) => {
        const { events, ...narrativeData } = item.narrative ?? {};
        return {
          ...narrativeData,
          narrativeId: item.narrativeId,
          simulationId: item.simulationId,
          isEvent: Boolean(events && events.length > 0),
        };
      }),
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

    const { events, ...narrativeData } = narrative;
    return plainToInstance(SimulatedNarrativeResponseDto, {
      ...narrativeData,
      narrativeId: created.narrativeId,
      simulationId: created.simulationId,
      isEvent: Boolean(events && events.length > 0),
    });
  }
}

