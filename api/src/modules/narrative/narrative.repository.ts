import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ILike,
  In,
  Between,
  Repository,
  ArrayContains,
  LessThanOrEqual,
  MoreThanOrEqual,
  type FindOptionsOrder,
  type FindOptionsWhere,
} from 'typeorm';
import { Narrative, SimulatedNarrative } from '../../entities';
import { POSTGRES_ERROR_CODES } from '../../consts/postgresErrorCode';
import { FindNarrativesQueryDto } from './dto/find-narratives-query-dto';
import { ListNarrativesQueryDto } from './dto/list-narratives-query-dto';
import { CreateSimulatedNarrativeDto } from './dto/create-simulated-narrative-dto';

@Injectable()
export class NarrativeRepository {
  constructor(
    @InjectRepository(Narrative)
    private readonly narrativeOrmRepository: Repository<Narrative>,
    @InjectRepository(SimulatedNarrative)
    private readonly simulatedNarrativeOrmRepository: Repository<SimulatedNarrative>,
  ) {}

  private createDetectedAtFilter(
    from?: Date | string,
    to?: Date | string,
  ): FindOptionsWhere<Narrative> {
    const start = from ? new Date(from) : undefined;
    const end = to ? new Date(to) : undefined;

    if (start && end) return { detectedAt: Between(start, end) };
    if (start) return { detectedAt: MoreThanOrEqual(start) };
    if (end) return { detectedAt: LessThanOrEqual(end) };
    return {};
  }

  private createNarrativeFilters({
    from,
    to,
    search,
    arena,
  }: ListNarrativesQueryDto): FindOptionsWhere<Narrative>[] {
    const filters: FindOptionsWhere<Narrative> = {
      ...(arena && { arena: ArrayContains([arena]) }),
      ...this.createDetectedAtFilter(from, to),
    };

    const pattern = search && `%${escapeLike(search)}%`;
    return pattern
      ? [
          { ...filters, title: ILike(pattern) },
          { ...filters, summary: ILike(pattern) },
        ]
      : [filters];
  }

  private createNarrativeOrder({
    sortBy,
    sortDir,
  }: ListNarrativesQueryDto): FindOptionsOrder<Narrative> {
    return {
      isFlagged: 'DESC',
      [sortBy]: { direction: sortDir, nulls: 'LAST' },
      narrativeId: 'ASC',
    };
  }

  findAll(query?: FindNarrativesQueryDto): Promise<Narrative[]> {
    return this.narrativeOrmRepository.find({
      where: this.createDetectedAtFilter(query?.startDate, query?.endDate),
      relations: { events: true },
    });
  }

  findPage(query: ListNarrativesQueryDto): Promise<[Narrative[], number]> {
    const { page, pageSize } = query;

    return this.narrativeOrmRepository.findAndCount({
      where: this.createNarrativeFilters(query),
      relations: { events: true },
      order: this.createNarrativeOrder(query),
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
  }

  findOne(narrativeId: string): Promise<Narrative | null> {
    return this.narrativeOrmRepository.findOne({
      where: { narrativeId },
      relations: { events: true },
    });
  }

  findManyByIds(narrativeIds: string[]): Promise<Narrative[]> {
    if (narrativeIds.length === 0) return Promise.resolve([]);

    return this.narrativeOrmRepository.find({
      where: { narrativeId: In(narrativeIds) },
      relations: { events: true },
    });
  }
  async update(
    narrativeId: string,
    changes: Partial<Pick<Narrative, 'isFlagged'>>,
  ): Promise<Narrative | null> {
    // TypeORM rejects an update with no values, so an empty body just returns the narrative.
    if (Object.keys(changes).length > 0) {
      const { affected } = await this.narrativeOrmRepository.update({ narrativeId }, changes);
      if (!affected) return null;
    }

    return this.findOne(narrativeId);
  }

  findSimulated(query?: FindNarrativesQueryDto): Promise<SimulatedNarrative[]> {
    return this.simulatedNarrativeOrmRepository.find({
      where: {
        narrative: this.createDetectedAtFilter(query?.startDate, query?.endDate),
      },
      relations: { narrative: { events: true } },
    });
  }

  findSimulatedPage(
    query: ListNarrativesQueryDto,
  ): Promise<[SimulatedNarrative[], number]> {
    const { page, pageSize } = query;

    return this.simulatedNarrativeOrmRepository.findAndCount({
      where: this.createNarrativeFilters(query).map((narrative) => ({ narrative })),
      relations: { narrative: { events: true } },
      order: { narrative: this.createNarrativeOrder(query) },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
  }
  
  createSimulated(
    data: CreateSimulatedNarrativeDto,
  ): Promise<SimulatedNarrative> {
    const simulatedNarrative = this.simulatedNarrativeOrmRepository.create(data);
    
    return this.simulatedNarrativeOrmRepository.save(simulatedNarrative);
  }

  async createSimulatedMany(
    data: CreateSimulatedNarrativeDto[],
  ): Promise<SimulatedNarrative[]> {
    if (data.length === 0) return [];

    try {
      const simulatedNarratives = this.simulatedNarrativeOrmRepository.create(data);
      return await this.simulatedNarrativeOrmRepository.save(simulatedNarratives);
    } catch (error: any) {
      if (error?.code === POSTGRES_ERROR_CODES.UNIQUE_VIOLATION) {
        throw new ConflictException('One or more simulated narratives already exist');
      }
      throw error;
    }
  }
}

const escapeLike = (value: string): string => value.replace(/[\\%_]/g, (c) => `\\${c}`);
