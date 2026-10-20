import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ActionModule } from './modules/action/action.module';
import { ActionTypeModule } from './modules/action-type/action-type.module';
import { EventLogModule } from './modules/event-log/event-log.module';
import { EventModule } from './modules/event/event.module';
import { NarrativeModule } from './modules/narrative/narrative.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../.env'] }),
    AuthModule,
    DatabaseModule,
    ActionModule,
    ActionTypeModule,
    EventLogModule,
    EventModule,
    NarrativeModule,
  ],
})
export class AppModule {}
