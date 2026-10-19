import { Injectable } from '@nestjs/common';
import { EventLogKind, LogClient } from '../../entities';
import { EventLogRepository } from './event-log.repository';

@Injectable()
export class EventLogService {
  constructor(private readonly eventLogRepository: EventLogRepository) {}

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
    await this.eventLogRepository.createLog({
      eventId: params.eventId,
      kind: params.kind,
      actorId: params.actorId,
      actionId: params.actionId ?? null,
      fromValue: params.fromValue ?? null,
      toValue: params.toValue ?? null,
      details: params.details ?? {},
      client: params.client ?? 'system',
    });
  }

  async logActionCreated(params: {
    eventId: string;
    actionId: string;
    actorId?: string;
    details?: Record<string, unknown>;
    client?: LogClient;
  }): Promise<void> {
    await this.createLog({
      eventId: params.eventId,
      kind: 'action_created',
      actorId: params.actorId ?? 'system',
      actionId: params.actionId,
      details: params.details ?? {},
      client: params.client ?? 'system',
    });
  }

  async logActionDeleted(params: {
    eventId: string;
    actionId: string;
    actorId?: string;
    details?: Record<string, unknown>;
    client?: LogClient;
  }): Promise<void> {
    await this.createLog({
      eventId: params.eventId,
      kind: 'action_deleted',
      actorId: params.actorId ?? 'system',
      actionId: params.actionId,
      fromValue: 'active',
      toValue: 'deleted',
      details: params.details ?? {},
      client: params.client ?? 'system',
    });
  }
}
