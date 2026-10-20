import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ILike,
  Between,
  Repository,
  ArrayContains,
  LessThanOrEqual,
  MoreThanOrEqual,
  type FindOptionsWhere,
} from 'typeorm';
import { Narrative, SimulatedNarrative } from '../../entities';
import { FindNarrativesQueryDto } from './dto/find-narratives-query-dto';
import { ListNarrativesQueryDto } from './dto/list-narratives-query-dto';

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

  findAll(query?: FindNarrativesQueryDto): Promise<Narrative[]> {
    return this.narrativeOrmRepository.find({
      where: this.createDetectedAtFilter(query?.startDate, query?.endDate),
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
      ...this.createDetectedAtFilter(from, to),
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

  findOneSimulated(simulationId: string): Promise<SimulatedNarrative | null> {
    return this.simulatedNarrativeOrmRepository.findOne({
      where: { simulationId },
      relations: { narrative: { events: true } },
    });
  }

  createSimulated(data: {
    narrativeId: string;
    simulationId: string;
  }): Promise<SimulatedNarrative> {
    const simulatedNarrative = this.simulatedNarrativeOrmRepository.create(data);
    
    return this.simulatedNarrativeOrmRepository.save(simulatedNarrative);
  }
}

const escapeLike = (value: string): string => value.replace(/[\\%_]/g, (c) => `\\${c}`);
