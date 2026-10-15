import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ActionTypeModule } from './modules/action-type/action-type.module';
import { EventModule } from './modules/event/event.module';

@Module({
  imports: [
    // The repo-root .env is shared with docker compose (DATABASE_URL, POSTGRES_*).
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../.env'] }),
    DatabaseModule,
    ActionTypeModule,
    EventModule,
  ],
})
export class AppModule {}
