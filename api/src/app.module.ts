import { Module } from '@nestjs/common';
import { ConditionalModule, ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ActionTypeModule } from './modules/action-type/action-type.module';
import { EventModule } from './modules/event/event.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { NarrativeModule } from './modules/narrative/narrative.module';

// API_WITHOUT_DB=true starts the API without the local DB and its modules, for teams that only
// read the mock (the mobile module). Unset, every module loads as usual.
const withDb = (env: NodeJS.ProcessEnv) => env.API_WITHOUT_DB !== 'true';

@Module({
  imports: [
    // The repo-root .env is shared with docker compose (DATABASE_URL, POSTGRES_*).
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../.env'] }),
    ConditionalModule.registerWhen(DatabaseModule, withDb),
    ConditionalModule.registerWhen(ActionTypeModule, withDb),
    ConditionalModule.registerWhen(EventModule, withDb),
    ConditionalModule.registerWhen(NarrativeModule, withDb),
    MobileModule,
  ],
})
export class AppModule {}
