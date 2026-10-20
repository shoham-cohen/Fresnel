jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => undefined,
}));

import { ForbiddenException } from '@nestjs/common';
import { Arena, DeviceToken } from '../../../entities';
import { AuthUser } from '../auth/auth-user';
import { DevicesRepository } from './devices.repository';
import { DevicesService } from './devices.service';

const dana: AuthUser = { id: 'sub-dana', username: 'dana.cohen', name: 'Dana', arenas: [Arena.IL], roles: [] };
const omar: AuthUser = { id: 'sub-omar', username: 'omar.k', name: 'Omar', arenas: [Arena.ARAB], roles: [] };
const TOKEN = 'ExponentPushToken[abc123]';

describe('DevicesService', () => {
  let repository: jest.Mocked<Pick<DevicesRepository, 'upsert' | 'findByToken' | 'deleteByToken'>>;
  let service: DevicesService;

  beforeEach(() => {
    repository = {
      upsert: jest.fn().mockResolvedValue(undefined),
      findByToken: jest.fn(),
      deleteByToken: jest.fn().mockResolvedValue(undefined),
    };
    service = new DevicesService(repository as unknown as DevicesRepository);
  });

  it('registers the phone for the signed-in user with the arenas from the token', async () => {
    await service.register(dana, { platform: 'ios', pushToken: TOKEN });
    expect(repository.upsert).toHaveBeenCalledWith({
      userId: 'sub-dana',
      platform: 'ios',
      pushToken: TOKEN,
      arenas: [Arena.IL],
    });
  });

  it('deletes the user’s own token', async () => {
    repository.findByToken.mockResolvedValue({ userId: 'sub-dana', pushToken: TOKEN } as DeviceToken);
    await service.unregister(dana, TOKEN);
    expect(repository.deleteByToken).toHaveBeenCalledWith(TOKEN);
  });

  it('does not let a user delete another user’s token (403)', async () => {
    repository.findByToken.mockResolvedValue({ userId: 'sub-dana', pushToken: TOKEN } as DeviceToken);
    await expect(service.unregister(omar, TOKEN)).rejects.toBeInstanceOf(ForbiddenException);
    expect(repository.deleteByToken).not.toHaveBeenCalled();
  });

  it('treats a token that is not registered as already deleted', async () => {
    repository.findByToken.mockResolvedValue(null);
    await expect(service.unregister(dana, TOKEN)).resolves.toBeUndefined();
    expect(repository.deleteByToken).not.toHaveBeenCalled();
  });
});
