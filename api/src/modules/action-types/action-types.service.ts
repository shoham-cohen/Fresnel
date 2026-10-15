import { Injectable } from '@nestjs/common';
import { ActionType } from '../../entities';
import { ActionTypesRepository } from './action-types.repository';

@Injectable()
export class ActionTypesService {
  constructor(private readonly actionTypes: ActionTypesRepository) {}

  findActive(): Promise<ActionType[]> {
    return this.actionTypes.findActive();
  }
}
