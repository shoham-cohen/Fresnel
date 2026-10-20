import { Injectable } from '@nestjs/common';
import { CloseEventDto } from './dto/close-event.dto';
import { CreateActionDto, CreatedAction } from './dto/create-action.dto';
import { ActionTypeItem, TimelineEntry } from './dto/timeline-entry';
import { MockApiClient, MockCaller } from './mock-api.client';

// The mobile "פעולות שבוצעו" tab. Every call is forwarded to fresnel-mock-api for now.
@Injectable()
export class ActionsPerformedService {
  constructor(private readonly mockApi: MockApiClient) {}

  getTimeline(eventId: string, caller: MockCaller): Promise<TimelineEntry[]> {
    return this.mockApi.request({ path: `/api/events/${eventId}/timeline`, caller });
  }

  getActionTypes(caller: MockCaller): Promise<ActionTypeItem[]> {
    return this.mockApi.request({ path: '/api/action-types', caller });
  }

  createAction(eventId: string, dto: CreateActionDto, caller: MockCaller): Promise<CreatedAction> {
    return this.mockApi.request({
      method: 'POST',
      path: `/api/events/${eventId}/actions`,
      caller,
      body: dto,
    });
  }

  deleteAction(actionId: string, caller: MockCaller): Promise<void> {
    return this.mockApi.request({ method: 'DELETE', path: `/api/actions/${actionId}`, caller });
  }

  closeEvent(eventId: string, dto: CloseEventDto, caller: MockCaller): Promise<void> {
    return this.mockApi.request({
      method: 'POST',
      path: `/api/events/${eventId}/close`,
      caller,
      body: dto,
    });
  }
}
