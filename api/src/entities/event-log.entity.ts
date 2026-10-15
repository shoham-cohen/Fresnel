import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Action } from './action.entity';
import { Event } from './event.entity';

export type EventLogKind =
  | 'event_created'
  | 'event_updated'
  | 'event_status_changed'
  | 'event_closed'
  | 'event_reopened'
  | 'action_created'
  | 'action_updated'
  | 'action_deleted';

export type LogClient = 'web' | 'mobile' | 'system';

// Append-only audit trail: the DB rejects UPDATE and DELETE.
@Entity({ schema: 'fresnel', name: 'event_log' })
export class EventLog {
  // bigint identity; pg returns it as a string so it never loses precision.
  @PrimaryColumn({ name: 'log_id', type: 'bigint', generated: 'identity', generatedIdentity: 'ALWAYS' })
  logId: string;

  @Column({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @ManyToOne(() => Event)
  @JoinColumn({ name: 'event_id' })
  event: Event;

  @Column({ name: 'action_id', type: 'uuid', nullable: true })
  actionId: string | null;

  @ManyToOne(() => Action, { nullable: true })
  @JoinColumn({ name: 'action_id' })
  action: Action | null;

  @Column({ type: 'text' })
  kind: EventLogKind;

  // A user id, or 'system'.
  @Column({ name: 'actor_id', type: 'text' })
  actorId: string;

  @Column({ name: 'from_value', type: 'text', nullable: true })
  fromValue: string | null;

  @Column({ name: 'to_value', type: 'text', nullable: true })
  toValue: string | null;

  @Column({ type: 'jsonb' })
  details: Record<string, unknown>;

  @Column({ type: 'text' })
  client: LogClient;

  @Column({ type: 'timestamptz' })
  at: Date;
}
