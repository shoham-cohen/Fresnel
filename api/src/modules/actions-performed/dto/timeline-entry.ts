// GET /api/actions-performed/events/:eventId/timeline returns these, newest first.
export interface TimelineEntry {
  kind: 'action' | 'event_created' | 'event_reopened';
  at: string;
  actorId: string;
  action: TimelineAction | null;
}

export interface TimelineAction {
  actionId: string;
  actionType: string;
  actionTypeLabel: string;
  title: string;
  description: string | null;
  performedBy: string;
}

// GET /api/actions-performed/action-types
export interface ActionTypeItem {
  code: string;
  labelHe: string;
  active: boolean;
}
