import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, Narrative, Severity } from '../../entities';

export interface FindActiveOptions {
  isSimulation: boolean;
  search?: string;
  page: number; // 1-based
  pageSize: number;
}

export interface CreateEventData {
  narrativeId: string;
  severity: Severity;
  isSimulation: boolean;
  createdBy: string;
}

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(Event)
    private readonly eventOrmRepository: Repository<Event>,
    @InjectRepository(Narrative)
    private readonly narrativeOrmRepository: Repository<Narrative>,
  ) {}

  findNarrativeById(narrativeId: string): Promise<Narrative | null> {
    return this.narrativeOrmRepository.findOne({
      where: { narrativeId },
    });
  }

  create(data: CreateEventData): Promise<Event> {
    const event = this.eventOrmRepository.create({
      narrativeId: data.narrativeId,
      severity: data.severity,
      status: 'open',
      isSimulation: data.isSimulation,
      createdBy: data.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      closedAt: null,
      closedBy: null,
      closureSummary: null,
    });
    return this.eventOrmRepository.save(event);
  }

  findActive({ isSimulation, search, page, pageSize }: FindActiveOptions): Promise<[Event[], number]> {
    const query = this.eventOrmRepository
      .createQueryBuilder('e')
      .innerJoinAndSelect('e.narrative', 'n')
      .where(`e.status <> 'closed'`)
      .andWhere('e.isSimulation = :isSimulation', { isSimulation })
      .orderBy('e.createdAt', 'DESC')
      .take(pageSize)
      .skip((page - 1) * pageSize);

    if (search) {
      query.andWhere('n.title ILIKE :pattern', { pattern: `%${escapeLike(search)}%` });
    }

    return query.getManyAndCount();
  }

  async findByIdWithNarrative(id: string): Promise<Event | null> {
    return this.eventOrmRepository.findOne({
      where: { eventId: id },
      relations: {
        narrative: true,
      },
    });
  }
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}
