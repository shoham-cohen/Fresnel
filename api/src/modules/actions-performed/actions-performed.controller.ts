import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ActionsPerformedService } from './actions-performed.service';
import { CloseEventDto } from './dto/close-event.dto';
import { CreateActionDto, CreatedAction } from './dto/create-action.dto';
import { ActionTypeItem, TimelineEntry } from './dto/timeline-entry';
import { MockCaller } from './mock-api.client';

type RequestHeaders = Record<string, string | undefined>;

// The phone sends the token from /api/mobile/auth. X-Mock-User (development only) still works for curl.
function callerFrom(headers: RequestHeaders): MockCaller {
  return { authorization: headers.authorization, mockUser: headers['x-mock-user'] };
}

@Controller('actions-performed')
export class ActionsPerformedController {
  constructor(private readonly actionsPerformedService: ActionsPerformedService) {}

  @Get('events/:eventId/timeline')
  getTimeline(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Headers() headers: RequestHeaders,
  ): Promise<TimelineEntry[]> {
    return this.actionsPerformedService.getTimeline(eventId, callerFrom(headers));
  }

  @Get('action-types')
  getActionTypes(@Headers() headers: RequestHeaders): Promise<ActionTypeItem[]> {
    return this.actionsPerformedService.getActionTypes(callerFrom(headers));
  }

  @Post('events/:eventId/actions')
  @HttpCode(HttpStatus.CREATED)
  createAction(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Body() dto: CreateActionDto,
    @Headers() headers: RequestHeaders,
  ): Promise<CreatedAction> {
    return this.actionsPerformedService.createAction(eventId, dto, callerFrom(headers));
  }

  @Delete('actions/:actionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAction(
    @Param('actionId', new ParseUUIDPipe()) actionId: string,
    @Headers() headers: RequestHeaders,
  ): Promise<void> {
    return this.actionsPerformedService.deleteAction(actionId, callerFrom(headers));
  }

  @Post('events/:eventId/close')
  @HttpCode(HttpStatus.NO_CONTENT)
  closeEvent(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Body() dto: CloseEventDto,
    @Headers() headers: RequestHeaders,
  ): Promise<void> {
    return this.actionsPerformedService.closeEvent(eventId, dto, callerFrom(headers));
  }
}
