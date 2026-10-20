import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Action } from '../../entities';

@Injectable()
export class ActionRepository {
  constructor(
    @InjectRepository(Action)
    private readonly actionOrmRepository: Repository<Action>,
  ) {}

  findById(actionId: string): Promise<Action | null> {
    return this.actionOrmRepository.findOne({
      where: {
        actionId,
        deletedAt: IsNull(),
      },
    });
  }

  countByEventId(eventId: string): Promise<number> {
    return this.actionOrmRepository.count({
      where: {
        eventId,
        deletedAt: IsNull(),
      },
    });
  }

  createForEvent(
    eventId: string,
    data: {
      actionType: string;
      title: string;
      description: string | null;
      performedBy: string;
    },
  ): Promise<Action> {
    const action = this.actionOrmRepository.create({
      eventId,
      actionTypeCode: data.actionType,
      title: data.title,
      description: data.description,
      performedBy: data.performedBy,
      performedAt: new Date(),
    });

    return this.actionOrmRepository.save(action);
  }

  findActionsByEventId(eventId: string): Promise<Action[]> {
    return this.actionOrmRepository.find({
      where: {
        eventId,
        deletedAt: IsNull(),
      },
      order: {
        performedAt: 'DESC',
      },
    });
  }

  async softDelete(actionId: string): Promise<void> {
    await this.actionOrmRepository.update(
      { actionId, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        // TODO: replace mock_user with the real authenticated user once auth is in place.
        deletedBy: 'mock_user',
      },
    );
  }
}
