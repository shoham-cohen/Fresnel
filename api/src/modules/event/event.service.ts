import { Injectable } from '@nestjs/common';
import { EventListPage } from './dto/event-list-item';
import { ListEventsQuery } from './dto/list-events.query';
import { EventRepository } from './event.repository';
import { CloseEventDto } from './dto/close-event.dto';
import { Event } from '../../entities';

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

  async closeEvent(id: string, dto: CloseEventDto): Promise<void> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new Error(`error occured when tried to close an event with id ${id}`);
    }

    await this.eventRepository.close(id, {
      closedBy: dto.closedBy,
      closureSummary: dto.closureSummary,
    });
  }

  async reopenEvent(id: string): Promise<void> {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new Error(`error occured when tried to reopen event with ${id}`);
    }

    await this.eventRepository.reopen(id);
  }
}
