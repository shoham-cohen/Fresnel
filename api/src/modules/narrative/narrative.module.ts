import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Narrative } from '../../entities';
import { NarrativeController } from './narrative.controller';
import { NarrativeService } from './narrative.service';
import { NarrativeRepository } from './narrative.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Narrative])],
  controllers: [NarrativeController],
  providers: [NarrativeService, NarrativeRepository],
  exports: [NarrativeService],
})
export class NarrativeModule {}
