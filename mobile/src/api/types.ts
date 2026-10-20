export type Arena = 'IL' | 'ARAB' | 'INTL';

export type TimelineAction = {
  actionId: string;
  actionType: string;
  actionTypeLabel: string;
  title: string;
  description: string | null;
  performedBy: string;
};

export type TimelineEntry = {
  kind: 'action' | 'event_created' | 'event_reopened';
  at: string;
  actorId: string;
  action: TimelineAction | null;
};
