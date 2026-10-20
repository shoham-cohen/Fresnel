import { Injectable } from '@nestjs/common';
import { CloseEventDto } from './dto/close-event.dto';
import { CreateActionDto, CreatedAction } from './dto/create-action.dto';
import { ActionTypeItem, TimelineEntry } from './dto/timeline-entry';
import { MockApiClient } from './mock-api.client';

// The mobile "פעולות שבוצעו" tab. Every call is forwarded to fresnel-mock-api for now.
@Injectable()
export class ActionsPerformedService {
  constructor(private readonly mockApi: MockApiClient) {}

  getTimeline(eventId: string, mockUser?: string): Promise<TimelineEntry[]> {
    return this.mockApi.request({ path: `/api/events/${eventId}/timeline`, mockUser });
  }

  getActionTypes(mockUser?: string): Promise<ActionTypeItem[]> {
    return this.mockApi.request({ path: '/api/action-types', mockUser });
  }

  createAction(eventId: string, dto: CreateActionDto, mockUser?: string): Promise<CreatedAction> {
    return this.mockApi.request({
      method: 'POST',
      path: `/api/events/${eventId}/actions`,
      mockUser,
      body: dto,
    });
  }

  deleteAction(actionId: string, mockUser?: string): Promise<void> {
    return this.mockApi.request({ method: 'DELETE', path: `/api/actions/${actionId}`, mockUser });
  }

  closeEvent(eventId: string, dto: CloseEventDto, mockUser?: string): Promise<void> {
    return this.mockApi.request({
      method: 'POST',
      path: `/api/events/${eventId}/close`,
      mockUser,
      body: dto,
    });
  }
}
