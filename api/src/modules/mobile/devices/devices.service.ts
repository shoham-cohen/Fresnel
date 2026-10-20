import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthUser } from '../auth/auth-user';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { DevicesRepository } from './devices.repository';

@Injectable()
export class DevicesService {
  constructor(private readonly devicesRepository: DevicesRepository) {}

  // MAR-17: the phone of the signed-in user, with the arenas from their token.
  register(user: AuthUser, { platform, pushToken }: RegisterDeviceDto): Promise<void> {
    return this.devicesRepository.upsert({ userId: user.id, platform, pushToken, arenas: user.arenas });
  }

  // Sign-out. A token that is not registered is already gone. Another user's token: 403.
  async unregister(user: AuthUser, pushToken: string): Promise<void> {
    const device = await this.devicesRepository.findByToken(pushToken);
    if (!device) return;
    if (device.userId !== user.id) {
      throw new ForbiddenException();
    }
    await this.devicesRepository.deleteByToken(pushToken);
  }
}
