import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Arena, DevicePlatform, DeviceToken } from '../../../entities';

export interface UpsertDeviceData {
  userId: string;
  platform: DevicePlatform;
  pushToken: string;
  arenas: Arena[];
}

// DB access for device_token only.
@Injectable()
export class DevicesRepository {
  constructor(@InjectRepository(DeviceToken) private readonly devices: Repository<DeviceToken>) {}

  // One row per token. A token that moves to another user (shared phone) moves with its arenas.
  async upsert(data: UpsertDeviceData): Promise<void> {
    await this.devices
      .createQueryBuilder()
      .insert()
      .into(DeviceToken)
      .values({ ...data, lastSeenAt: () => 'now()' })
      .orUpdate(['user_id', 'platform', 'arenas', 'last_seen_at'], ['push_token'])
      .execute();
  }

  findByToken(pushToken: string): Promise<DeviceToken | null> {
    return this.devices.findOne({ where: { pushToken } });
  }

  async deleteByToken(pushToken: string): Promise<void> {
    await this.devices.delete({ pushToken });
  }

  // For the Push sender (MAR-19): every token of a phone whose user is in one of these arenas.
  async findTokensByArenas(arenas: Arena[]): Promise<string[]> {
    if (arenas.length === 0) return [];
    const rows = await this.devices
      .createQueryBuilder('d')
      .select('d.pushToken', 'pushToken')
      .where('d.arenas && :arenas', { arenas })
      .getRawMany<{ pushToken: string }>();
    return rows.map((row) => row.pushToken);
  }
}
