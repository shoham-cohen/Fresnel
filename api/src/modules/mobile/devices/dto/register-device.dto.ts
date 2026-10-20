import { IsIn, Matches } from 'class-validator';
import type { DevicePlatform } from '../../../../entities';

export const EXPO_PUSH_TOKEN = /^ExponentPushToken\[[^\]]+\]$/;

// POST /api/devices. The user comes from the token, never from the body.
export class RegisterDeviceDto {
  @IsIn(['android', 'ios'])
  platform: DevicePlatform;

  @Matches(EXPO_PUSH_TOKEN, { message: 'pushToken must be an Expo push token (ExponentPushToken[...])' })
  pushToken: string;
}
