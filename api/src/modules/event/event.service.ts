import { Injectable, NotFoundException } from '@nestjs/common';
import { EventListPage } from './dto/event-list-item';
import { EventDetailDto } from './dto/event-detail.dto';
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

  async getEventById(id: string): Promise<EventDetailDto> {
    const event = await this.eventRepository.findByIdWithNarrative(id);

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    return {
      eventId: event.eventId,
      title: event.narrative?.title ?? '',
      description: event.narrative?.summary ?? null,
      arena: event.narrative?.arena ?? null,
      detectedAt: event.narrative?.detectedAt ?? event.createdAt,
      openedBy: event.createdBy,
      closedBy: event.closedBy,
      status: event.status,
      severity: event.severity,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
      closedAt: event.closedAt,
      closureSummary: event.closureSummary,
    };
  }
}
