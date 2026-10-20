import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ActionModule } from './modules/action/action.module';
import { ActionTypeModule } from './modules/action-type/action-type.module';
import { EventLogModule } from './modules/event-log/event-log.module';
import { EventModule } from './modules/event/event.module';
import { NarrativeModule } from './modules/narrative/narrative.module';

@Module({
  imports: [
    // The repo-root .env is shared with docker compose (DATABASE_URL, POSTGRES_*).
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../.env'] }),
    DatabaseModule,
    ActionModule,
    ActionTypeModule,
    EventLogModule,
    EventModule,
    NarrativeModule,
  ],
})
export class AppModule {}
