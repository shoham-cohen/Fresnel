import { Injectable } from '@nestjs/common';
import { ActionType } from '../../entities';
import { ActionTypeRepository } from './action-type.repository';

@Injectable()
export class ActionTypeService {
  constructor(private readonly actionTypeRepository: ActionTypeRepository) {}

  findActive(): Promise<ActionType[]> {
    return this.actionTypeRepository.findActive();
  }
}