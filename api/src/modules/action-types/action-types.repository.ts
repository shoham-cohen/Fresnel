import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActionType } from '../../entities';

@Injectable()
export class ActionTypesRepository {
  constructor(
    @InjectRepository(ActionType)
    private readonly repo: Repository<ActionType>,
  ) {}

  findActive(): Promise<ActionType[]> {
    // "other" goes last in the dropdown; the rest are sorted by their Hebrew label.
    return this.repo
      .createQueryBuilder('t')
      .where('t.active')
      .orderBy(`t.code = 'other'`)
      .addOrderBy('t.labelHe')
      .getMany();
  }
}
