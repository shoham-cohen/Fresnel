import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Arena } from './narrative.entity';

export type DevicePlatform = 'android' | 'ios';

// A phone registered for Push (POST /api/devices). One row per Expo push token. Owned by Marconi.
@Entity({ schema: 'fresnel', name: 'device_token' })
export class DeviceToken {
  @PrimaryColumn({ name: 'device_id', type: 'uuid', default: () => 'gen_random_uuid()' })
  deviceId: string;

  // The Keycloak subject (`sub`) of the signed-in user.
  @Column({ name: 'user_id', type: 'text' })
  userId: string;

  @Column({ type: 'text' })
  platform: DevicePlatform;

  // ExponentPushToken[...]
  @Column({ name: 'push_token', type: 'text', unique: true })
  pushToken: string;

  // The user's arenas from the token, refreshed on every registration (db/4.ddl.sql).
  @Column({ type: 'text', array: true, default: () => `'{}'` })
  arenas: Arena[];

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'last_seen_at', type: 'timestamptz', default: () => 'now()' })
  lastSeenAt: Date;
}
