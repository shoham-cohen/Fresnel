jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => undefined,
}));

import { EventController } from './event.controller';
import type { EventService } from './event.service';

describe('EventController', () => {
  it('passes the closed interval query params to the service', async () => {
    const listClosed = jest.fn().mockResolvedValue([{ eventId: 'evt-1' }]);
    const service = { listClosed } as unknown as EventService;
    const controller = new EventController(service);

    const result = await controller.listClosed({
      closed_after: '2026-10-01T00:00:00.000Z',
      closed_before: '2026-10-31T23:59:59.000Z',
    });

    expect(listClosed).toHaveBeenCalledWith(
      '2026-10-01T00:00:00.000Z',
      '2026-10-31T23:59:59.000Z',
    );
    expect(result).toEqual([{ eventId: 'evt-1' }]);
  });

  it('supports omitting the optional closed_before param', async () => {
    const listClosed = jest.fn().mockResolvedValue([{ eventId: 'evt-2' }]);
    const service = { listClosed } as unknown as EventService;
    const controller = new EventController(service);

    const result = await controller.listClosed({
      closed_after: '2026-10-01T00:00:00.000Z',
    });

    expect(listClosed).toHaveBeenCalledWith('2026-10-01T00:00:00.000Z', undefined);
    expect(result).toEqual([{ eventId: 'evt-2' }]);
  });

  it('handles an empty query object safely', async () => {
    const listClosed = jest.fn().mockResolvedValue([]);
    const service = { listClosed } as unknown as EventService;
    const controller = new EventController(service);

    const result = await controller.listClosed({} as any);

    expect(listClosed).toHaveBeenCalledWith(undefined, undefined);
    expect(result).toEqual([]);
  });
});
