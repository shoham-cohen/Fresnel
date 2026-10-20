
import type { AxiosInstance } from 'axios';
import { createAxiosInstance } from '@/config/axios.config';
import type { CreateEventDto } from '@/interfaces/event-api.interface';

class EventService {
  private api: AxiosInstance;

  constructor() {
    this.api = createAxiosInstance('/events');
  }

  public async create(dto: CreateEventDto): Promise<void> {
    await this.api.post('/', dto);
  }
}

export const eventService = new EventService();
