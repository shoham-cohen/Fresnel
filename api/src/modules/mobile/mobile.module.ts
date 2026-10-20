import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceToken } from '../../entities';
import { MobileAuthGuard } from './auth/mobile-auth.guard';
import { MobileTokenVerifier } from './auth/mobile-token.verifier';
import { DataLakeClient } from './data-lake.client';
import { DevicesController } from './devices/devices.controller';
import { DevicesRepository } from './devices/devices.repository';
import { DevicesService } from './devices/devices.service';
import { EventsClient } from './events.client';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

// Team Marconi's routes for the mobile app. Every controller here is behind MobileAuthGuard.
@Module({
  imports: [TypeOrmModule.forFeature([DeviceToken])],
  controllers: [EventsController, ItemsController, DevicesController],
  providers: [
    EventsService,
    EventsClient,
    ItemsService,
    DataLakeClient,
    DevicesService,
    DevicesRepository,
    {
      provide: MobileTokenVerifier,
      useFactory: (config: ConfigService) => MobileTokenVerifier.fromConfig(config),
      inject: [ConfigService],
    },
    MobileAuthGuard,
  ],
  exports: [DevicesRepository],
})
export class MobileModule {}
