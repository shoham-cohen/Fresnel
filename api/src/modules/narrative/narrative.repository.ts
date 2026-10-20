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
  type FindOptionsWhere,
} from 'typeorm';
import { Narrative, SimulatedNarrative } from '../../entities';
import { POSTGRES_ERROR_CODES } from '../../consts/postgresErrorCode';
import { ListNarrativesQueryDto } from './dto/list-narratives-query-dto';

export type CreateSimulatedNarrativeData = {
  narrativeId: string;
  simulationId: string;
};

@Injectable()
export class NarrativeRepository {
  constructor(
    @InjectRepository(Narrative)
    private readonly narrativeOrmRepository: Repository<Narrative>,
    @InjectRepository(SimulatedNarrative)
    private readonly simulatedNarrativeOrmRepository: Repository<SimulatedNarrative>,
  ) {}

  findAll(): Promise<Narrative[]> {
    return this.narrativeOrmRepository.find({
      relations: { events: true },
    });
  }

  findPage({
    from,
    to,
    search,
    arena,
    page,
    pageSize,
    sortBy,
    sortDir,
  }: ListNarrativesQueryDto): Promise<[Narrative[], number]> {
    const filters: FindOptionsWhere<Narrative> = {
      ...(arena && { arena: ArrayContains([arena]) }),
      ...((from || to) && { detectedAt: detectedAtRange(from, to) }),
    };

    const pattern = search && `%${escapeLike(search)}%`;
    const where = pattern
      ? [
          { ...filters, title: ILike(pattern) },
          { ...filters, summary: ILike(pattern) },
        ]
      : filters;

    return this.narrativeOrmRepository.findAndCount({
      where,
      relations: { events: true },
      order: {
        isFlagged: 'DESC',
        [sortBy]: { direction: sortDir, nulls: 'LAST' },
        narrativeId: 'ASC',
      },
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

  // Returns the updated narrative, or null when there is no narrative with this id.
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

  findSimulated(simulationId?: string): Promise<SimulatedNarrative[]> {
    return this.simulatedNarrativeOrmRepository.find({
      where: simulationId ? { simulationId } : {},
      relations: { narrative: { events: true } },
    });
  }

  createSimulated(
    data: CreateSimulatedNarrativeData,
  ): Promise<SimulatedNarrative> {
    const simulatedNarrative = this.simulatedNarrativeOrmRepository.create(data);
    
    return this.simulatedNarrativeOrmRepository.save(simulatedNarrative);
  }

  async createSimulatedMany(
    data: CreateSimulatedNarrativeData[],
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

const detectedAtRange = (from?: string, to?: string) => {
  if (from && to) return Between(new Date(from), new Date(to));
  return from ? MoreThanOrEqual(new Date(from)) : LessThanOrEqual(new Date(to as string));
};

const escapeLike = (value: string): string => value.replace(/[\\%_]/g, (c) => `\\${c}`);
