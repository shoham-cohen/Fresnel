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

// Development only: X-Mock-User picks the user the mock acts as. It is forwarded as is.
const MOCK_USER_HEADER = 'x-mock-user';

@Controller('actions-performed')
export class ActionsPerformedController {
  constructor(private readonly actionsPerformedService: ActionsPerformedService) {}

  @Get('events/:eventId/timeline')
  getTimeline(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Headers(MOCK_USER_HEADER) mockUser?: string,
  ): Promise<TimelineEntry[]> {
    return this.actionsPerformedService.getTimeline(eventId, mockUser);
  }

  @Get('action-types')
  getActionTypes(@Headers(MOCK_USER_HEADER) mockUser?: string): Promise<ActionTypeItem[]> {
    return this.actionsPerformedService.getActionTypes(mockUser);
  }

  @Post('events/:eventId/actions')
  @HttpCode(HttpStatus.CREATED)
  createAction(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Body() dto: CreateActionDto,
    @Headers(MOCK_USER_HEADER) mockUser?: string,
  ): Promise<CreatedAction> {
    return this.actionsPerformedService.createAction(eventId, dto, mockUser);
  }

  @Delete('actions/:actionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAction(
    @Param('actionId', new ParseUUIDPipe()) actionId: string,
    @Headers(MOCK_USER_HEADER) mockUser?: string,
  ): Promise<void> {
    return this.actionsPerformedService.deleteAction(actionId, mockUser);
  }

  @Post('events/:eventId/close')
  @HttpCode(HttpStatus.NO_CONTENT)
  closeEvent(
    @Param('eventId', new ParseUUIDPipe()) eventId: string,
    @Body() dto: CloseEventDto,
    @Headers(MOCK_USER_HEADER) mockUser?: string,
  ): Promise<void> {
    return this.actionsPerformedService.closeEvent(eventId, dto, mockUser);
  }
}
