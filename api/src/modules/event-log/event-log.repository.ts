import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventLog, EventLogKind, LogClient } from '../../entities';

@Injectable()
export class EventLogRepository {
  constructor(
    @InjectRepository(EventLog)
    private readonly eventLogOrmRepository: Repository<EventLog>,
  ) {}

  async createLog(params: {
    eventId: string;
    kind: EventLogKind;
    actorId: string;
    actionId?: string | null;
    fromValue?: string | null;
    toValue?: string | null;
    details?: Record<string, unknown>;
    client?: LogClient;
  }): Promise<void> {
    const log = this.eventLogOrmRepository.create({
      eventId: params.eventId,
      actionId: params.actionId ?? null,
      kind: params.kind,
      actorId: params.actorId,
      fromValue: params.fromValue ?? null,
      toValue: params.toValue ?? null,
      details: params.details ?? {},
      client: params.client ?? 'system',
      at: new Date(),
    });

    await this.eventLogOrmRepository.save(log);
  }
}
