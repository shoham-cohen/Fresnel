import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>('DATABASE_URL'),
        entities,
        // The schema comes from db/schema.sql and its migrations, never from the entities.
        synchronize: false,
        // pg_trgm and vector are created by db/schema.sql.
        installExtensions: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
