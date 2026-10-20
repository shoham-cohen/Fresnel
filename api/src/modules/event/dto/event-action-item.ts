export interface EventActionItem {
  actionId: string;
  title: string;
  description: string | null;
  actionTypeCode: string;
  performedBy: string;
  performedAt: Date;
}
