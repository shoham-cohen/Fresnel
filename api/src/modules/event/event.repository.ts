import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Event, EventLog } from '../../entities';

export interface FindActiveOptions {
  isSimulation: boolean;
  search?: string;
  page: number; // 1-based
  pageSize: number;
}

export interface CloseEventPayload {
  closedAt: string;
  closedBy: string;
  closureSummary: string;
}

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(Event)
    private readonly eventOrmRepository: Repository<Event>,
    @InjectRepository(EventLog)
    private readonly eventLogOrmRepository: Repository<EventLog>,
    private readonly dataSource: DataSource,
  ) {}

  // Open and in-progress events, newest first, with their narrative for the title.
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
      // Served by the trigram index on narrative.title.
      query.andWhere('n.title ILIKE :pattern', { pattern: `%${escapeLike(search)}%` });
    }

    return query.getManyAndCount();
  }

  async findById(id: string): Promise<Event | null> {
    return this.eventOrmRepository.findOne({ where: { eventId: id } });
  }

  async close(id: string, payload: CloseEventPayload): Promise<void> {
    const event = await this.findById(id);

    if (!event) {
      throw new Error(`error occured when tried to close an event with id ${id}`);
    }

    const closedAt = new Date(payload.closedAt);

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
      fromValue: event.status,
      toValue: 'closed',
      details: {
        closedAt: payload.closedAt,
        closedBy: payload.closedBy,
        closureSummary: payload.closureSummary,
      },
      client: 'web',
      at: closedAt,
    });
  }

  async reopen(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const currentEvent = await queryRunner.manager.findOne(Event, { where: { eventId: id } });

      if (!currentEvent) {
        throw new Error(`error occured when tried to reopen event with ${id}`);
      }

      const reopenedAt = new Date();

      await queryRunner.manager.save(Event, {
        ...currentEvent,
        status: 'in_progress',
        closedAt: null,
        closedBy: null,
        closureSummary: null,
        updatedAt: reopenedAt,
      });

      await queryRunner.manager.insert(EventLog, {
        eventId: id,
        kind: 'event_reopened',
        actorId: 'system',
        fromValue: 'closed',
        toValue: 'in_progress',
        details: {
          reopenedAt: reopenedAt.toISOString(),
        },
        client: 'web',
        at: reopenedAt,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}
