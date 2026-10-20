import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, Narrative, Severity, EventLog, EventStatus } from '../../entities';

export interface FindActiveOptions {
  isSimulation: boolean;
  simulationId?: string | null;
  search?: string;
  page: number; // 1-based
  pageSize: number;
}

export interface FindClosedEventsOptions {
  closedAfter: Date;
  closedBefore?: Date;
}

export interface CloseEventPayload {
  closedBy: string;
  closureSummary: string;
}

export interface CreateEventData {
  narrativeId: string;
  severity: Severity;
  isSimulation: boolean;
  simulationId?: string | null;
  createdBy: string;
}

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(Event)
    private readonly eventOrmRepository: Repository<Event>,
    @InjectRepository(EventLog)
    private readonly eventLogOrmRepository: Repository<EventLog>,
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
      simulationId: data.simulationId ?? null,
      createdBy: data.createdBy,
      createdAt: new Date(),
      updatedAt: new Date(),
      closedAt: null,
      closedBy: null,
      closureSummary: null,
    });
    return this.eventOrmRepository.save(event);
  }

  findActive({ isSimulation, simulationId, search, page, pageSize }: FindActiveOptions): Promise<[Event[], number]> {
    const query = this.eventOrmRepository
      .createQueryBuilder('e')
      .leftJoin('e.narrative', 'n')
      .addSelect(['n.narrativeId', 'n.title', 'n.summary', 'n.arena', 'n.detectedAt'])
      .where(`e.status <> 'closed'`)
      .andWhere('e.isSimulation = :isSimulation', { isSimulation });

    if (simulationId !== undefined) {
      query.andWhere('e.simulation_id = :simulationId', { simulationId });
    }

    query
      .orderBy('e.createdAt', 'DESC')
      .take(pageSize)
      .skip((page - 1) * pageSize);

    if (search) {
      query.andWhere('n.title ILIKE :pattern', { pattern: `%${escapeLike(search)}%` });
    }

    return query.getManyAndCount();
  }

  async findBySimulationId(simulationId: string): Promise<Event[]> {
    return this.eventOrmRepository
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.narrative', 'n')
      .leftJoinAndSelect('e.actions', 'a')
      .leftJoinAndSelect('a.actionType', 'at')
      .where('e.simulation_id = :simulationId', { simulationId })
      .andWhere('e.isSimulation = :isSimulation', { isSimulation: true })
      .orderBy('e.createdAt', 'DESC')
      .addOrderBy('a.performedAt', 'DESC')
      .getMany();
  }

  async findClosedWithinPeriod({ closedAfter, closedBefore }: FindClosedEventsOptions): Promise<Event[]> {
    const query = this.eventOrmRepository
      .createQueryBuilder('e')
      .leftJoin('e.narrative', 'n')
      .addSelect(['n.narrativeId', 'n.title', 'n.summary', 'n.arena', 'n.detectedAt'])
      .leftJoinAndSelect('e.actions', 'a')
      .leftJoinAndSelect('a.actionType', 'at')
      .where('e.status = :status', { status: 'closed' })
      .andWhere('e.closedAt >= :closedAfter', { closedAfter })
      .orderBy('e.closedAt', 'DESC')
      .addOrderBy('a.performedAt', 'DESC');

    if (closedBefore) {
      query.andWhere('e.closedAt < :closedBefore', { closedBefore });
    }

    return query.getMany();
  }
  async findEventById(eventId: string): Promise<Event | null> {
    return this.eventOrmRepository.findOne({
      where: {
        eventId,
      },
    });
  }

  async updateStatus(eventId: string, status: EventStatus): Promise<void> {
    await this.eventOrmRepository.update(eventId, { status });
  }

  async findById(id: string): Promise<Event | null> {
    return this.eventOrmRepository.findOne({ where: { eventId: id } });
  }

  async close(id: string, payload: CloseEventPayload): Promise<void> {
    const event = await this.findById(id);

    const closedAt = new Date();

    await this.eventOrmRepository.save({
      ...event,
      status: 'closed',
      closedAt,
      closedBy: payload.closedBy,
      closureSummary: payload.closureSummary,
      updatedAt: closedAt,
    });

    await this.eventLogOrmRepository.insert({
      eventId: id,
      kind: 'event_closed',
      actorId: payload.closedBy,
      fromValue: event!.status,
      toValue: 'closed',
      details: {
        closedAt: closedAt.toISOString(),
        closedBy: payload.closedBy,
        closureSummary: payload.closureSummary,
      },
      client: 'web',
      at: closedAt,
    });
  }

  async reopen(id: string): Promise<void> {
    const event = await this.findById(id);

    const reopenedAt = new Date();

    await this.eventOrmRepository.save({
      ...event,
      status: 'in_progress',
      closedAt: null,
      closedBy: null,
      closureSummary: null,
      updatedAt: reopenedAt,
    });

    await this.eventLogOrmRepository.insert({
      eventId: id,
      kind: 'event_reopened',
      actorId: 'system',
      fromValue: event!.status,
      toValue: 'in_progress',
      details: {
        reopenedAt: reopenedAt.toISOString(),
      },
      client: 'web',
      at: reopenedAt,
    });
  }
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}
