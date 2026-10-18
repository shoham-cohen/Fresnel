import { Injectable, NotFoundException } from '@nestjs/common';
import { Action } from '../../entities';
import { EventListPage } from './dto/event-list-item';
import { ListEventsQuery } from './dto/list-events.query';
import { EventRepository } from './event.repository';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async list({ isSimulation, search, page, pageSize }: ListEventsQuery): Promise<EventListPage> {
    const [events, total] = await this.eventRepository.findActive({
      isSimulation,
      search: search?.trim() || undefined,
      page,
      pageSize,
    });

    return {
      items: events.map((e) => ({
        eventId: e.eventId,
        title: e.narrative.title,
        status: e.status,
        severity: e.severity,
        createdAt: e.createdAt,
      })),
      total,
      page,
      pageSize,
    };
  }

  async getActionsForEvent(eventId: string, isSimulation: boolean): Promise<Action[]> {
    const event = await this.eventRepository.findEventById(eventId, isSimulation);

    if (!event) {
      throw new NotFoundException(`Event ${eventId} not found`);
    }

    if (event.status === 'closed') {
      throw new NotFoundException(`Event ${eventId} is closed and actions are not available`);
    }

    return this.eventRepository.findActionsByEventId(eventId);
  }
}
