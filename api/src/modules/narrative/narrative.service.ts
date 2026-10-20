import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Narrative } from '../../entities';
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

  private mapNarrativeToNarrativeResponseDto(
    narrative: Narrative,
  ): NarrativeResponseDto {
    const { events, ...data } = narrative;

    return plainToInstance(NarrativeResponseDto, {
      ...data,
      isEvent: Boolean(events && events.length > 0),
      simulationId: null,
    });
  }

  async findAll(
    query?: FindNarrativesQueryDto,
  ): Promise<NarrativeResponseDto[]> {
    const narratives = await this.narrativeRepository.findAll(query);

    return narratives.map((narrative) =>
      this.mapNarrativeToNarrativeResponseDto(narrative),
    );
  }

  async findPage(query: ListNarrativesQueryDto): Promise<NarrativeListPageDto> {
    const [narratives, total] = await this.narrativeRepository.findPage(query);

    return {
      items: narratives.map((narrative) =>
        this.mapNarrativeToNarrativeResponseDto(narrative),
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

    return this.mapNarrativeToNarrativeResponseDto(updated);
  }

  async findSimulated(
    query?: FindNarrativesQueryDto,
  ): Promise<SimulatedNarrativeResponseDto[]> {
    const simulatedNarratives =
      await this.narrativeRepository.findSimulated(query);

    return plainToInstance(
      SimulatedNarrativeResponseDto,
      simulatedNarratives.map(({ simulationId, narrative }) => {
        return {
          ...this.mapNarrativeToNarrativeResponseDto(narrative),
          simulationId: simulationId,
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
            ...this.mapNarrativeToNarrativeResponseDto(narrative),
            simulationId: simulationId,
          };
        }),
      ),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
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

    return created.map((item) => {
      const narrative = narrativeMap.get(item.narrativeId)!;
      return plainToInstance(SimulatedNarrativeResponseDto, {
        ...this.mapNarrativeToNarrativeResponseDto(narrative),
        simulationId: item.simulationId,
      });
    });
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
