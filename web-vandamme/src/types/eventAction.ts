export type CreateEventActionPayload = {
  actionTypeCode: string
  title: string
  description: string
}

export type EventActionItem = {
  id: string
  [key: string]: unknown
}