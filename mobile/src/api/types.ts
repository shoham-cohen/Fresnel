export type Arena = 'IL' | 'ARAB' | 'INTL';

export type TimelineAction = {
  actionId: string;
  actionType: string;
  actionTypeLabel: string;
  title: string;
  description: string | null;
  performedBy: string;
};

export type ActionType = {
  code: string;
  labelHe: string;
  active: boolean;
};

export type CreateActionBody = {
  actionType: string;
  title: string;
  description: string;
};

export type CloseEventBody = {
  closureSummary: string;
  closedBy: string;
};

export type TimelineEntry = {
  kind: 'action' | 'event_created' | 'event_reopened';
  at: string;
  actorId: string;
  action: TimelineAction | null;
};
