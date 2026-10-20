import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from '../auth/auth-user';
import { CurrentUser } from '../auth/current-user.decorator';
import { MobileAuthGuard } from '../auth/mobile-auth.guard';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { DevicesService } from './devices.service';

// MAR-17: the phones registered for Push.
@Controller('devices')
@UseGuards(MobileAuthGuard)
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  register(@CurrentUser() user: AuthUser, @Body() dto: RegisterDeviceDto): Promise<void> {
    return this.devicesService.register(user, dto);
  }

  @Delete(':token')
  @HttpCode(HttpStatus.NO_CONTENT)
  unregister(@CurrentUser() user: AuthUser, @Param('token') token: string): Promise<void> {
    return this.devicesService.unregister(user, token);
  }
}
