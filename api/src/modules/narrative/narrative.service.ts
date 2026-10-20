import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Narrative } from '../../entities';
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
    return narratives.map(toNarrativeResponseDto);
  }

  async findPage(query: ListNarrativesQueryDto): Promise<NarrativeListPageDto> {
    const [narratives, total] = await this.narrativeRepository.findPage(query);

    return {
      items: narratives.map(toNarrativeResponseDto),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  async findOne(narrativeId: string): Promise<NarrativeResponseDto | null> {
    const narrative = await this.narrativeRepository.findOne(narrativeId);
    return narrative ? toNarrativeResponseDto(narrative) : null;
  }

  async update(
    narrativeId: string,
    dto: UpdateNarrativeDto,
  ): Promise<NarrativeResponseDto> {
    const updated = await this.narrativeRepository.update(narrativeId, dto);

    if (!updated) {
      throw new NotFoundException(`Narrative with id ${narrativeId} not found`);
    }

    return toNarrativeResponseDto(updated);
  }

  async findSimulated(
    simulationId?: string,
  ): Promise<SimulatedNarrativeResponseDto[]> {
    const simulatedNarratives =
      await this.narrativeRepository.findSimulated(simulationId);

    return simulatedNarratives.map((item) =>
      toSimulatedNarrativeResponseDto(
        item.narrative,
        item.narrativeId,
        item.simulationId,
      ),
    );
  }

  async createSimulated(
    dtos: CreateSimulatedNarrativeDto[],
  ): Promise<SimulatedNarrativeResponseDto[]> {
    if (dtos.length === 0) {
      return [];
    }

    const uniqueNarrativeIds = validateUniqueSimulatedNarratives(dtos);
    const narratives =
      await this.narrativeRepository.findManyByIds(uniqueNarrativeIds);
    validateAllNarrativesExist(uniqueNarrativeIds, narratives);

    const created = await this.narrativeRepository.createSimulatedMany(dtos);
    const narrativeMap = new Map(
      narratives.map((narrative) => [narrative.narrativeId, narrative]),
    );

    return created.map((item) =>
      toSimulatedNarrativeResponseDto(
        narrativeMap.get(item.narrativeId),
        item.narrativeId,
        item.simulationId,
      ),
    );
  }
}

const validateUniqueSimulatedNarratives = (
  dtos: CreateSimulatedNarrativeDto[],
): string[] => {
  const seenSimulationsByNarrative = new Map<string, Set<string>>();

  for (const dto of dtos) {
    const simulationIds = seenSimulationsByNarrative.get(dto.narrativeId);
    if (simulationIds?.has(dto.simulationId)) {
      throw new ConflictException(
        `Duplicate narrative and simulation combination in payload: narrativeId '${dto.narrativeId}', simulationId '${dto.simulationId}'`,
      );
    }
    if (!simulationIds) {
      seenSimulationsByNarrative.set(
        dto.narrativeId,
        new Set([dto.simulationId]),
      );
    } else {
      simulationIds.add(dto.simulationId);
    }
  }

  return Array.from(seenSimulationsByNarrative.keys());
};

const validateAllNarrativesExist = (
  expectedIds: string[],
  foundNarratives: Narrative[],
): void => {
  if (foundNarratives.length !== expectedIds.length) {
    const foundIds = new Set(foundNarratives.map((n) => n.narrativeId));
    const missingIds = expectedIds.filter((id) => !foundIds.has(id));
    throw new BadRequestException(
      `Narratives with ids [${missingIds.join(', ')}] not found`,
    );
  }
};

const toNarrativeResponseDto = (narrative: Narrative): NarrativeResponseDto => {
  const { events, ...data } = narrative;
  return plainToInstance(NarrativeResponseDto, {
    ...data,
    isEvent: Boolean(events && events.length > 0),
  });
};

const toSimulatedNarrativeResponseDto = (
  narrative: Narrative | undefined,
  narrativeId: string,
  simulationId: string,
): SimulatedNarrativeResponseDto => {
  const { events, ...narrativeData } = narrative ?? {};
  return plainToInstance(SimulatedNarrativeResponseDto, {
    ...narrativeData,
    narrativeId,
    simulationId,
    isEvent: Boolean(events && events.length > 0),
  });
};

