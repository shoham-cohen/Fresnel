import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ActionType } from './action-type.entity';
import { Event } from './event.entity';

// An action documented in an event after it was done. Soft-deleted, never removed.
@Entity({ schema: 'fresnel', name: 'action' })
export class Action {
  @PrimaryColumn({ name: 'action_id', type: 'uuid', default: () => 'gen_random_uuid()' })
  actionId: string;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name: 'action_type', type: 'text' })
  actionTypeCode: string;

  @ManyToOne(() => ActionType)
  @JoinColumn({ name: 'action_type' })
  actionType: ActionType;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'performed_by', type: 'text' })
  performedBy: string;

  @Column({ name: 'performed_at', type: 'timestamptz' })
  performedAt: Date;

  // Set by a DB trigger on every UPDATE.
  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @Column({ name: 'deleted_by', type: 'text', nullable: true })
  deletedBy: string | null;
}
