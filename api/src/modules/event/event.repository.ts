import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from '../../entities';

export interface FindActiveOptions {
  isSimulation: boolean;
  search?: string;
  page: number; // 1-based
  pageSize: number;
}

@Injectable()
export class EventRepository {
  constructor(
    @InjectRepository(Event)
    private readonly eventOrmRepository: Repository<Event>,
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
}

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}
