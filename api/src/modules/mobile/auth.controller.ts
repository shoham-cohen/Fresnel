import { Controller, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { AuthClient } from './auth.client';
import { MobileSession } from './dto/mobile-session';

@Controller('mobile/auth')
export class AuthController {
  constructor(private readonly authClient: AuthClient) {}

  // The SSO button on the login screen. A random mock user on every call, never `exclude`.
  @Post()
  @HttpCode(HttpStatus.OK)
  signIn(@Query('exclude') excludeUserId?: string): Promise<MobileSession> {
    return this.authClient.signIn(excludeUserId || undefined);
  }
}
