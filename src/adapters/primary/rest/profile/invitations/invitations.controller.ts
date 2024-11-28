import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { PaginatedRequest } from '@Common/utils/paginated.request';
import { RestfulExceptionFilter } from '@Common/filters/restful.exceptionFilter';
import {
  HttpResponseDecorator,
  OFoodResponse,
} from '@Common/decorators/httpResponseDecorator.interceptor';
import InvitationsApplicationService from '@PrimaryAdapters/rest/profile/invitations/invitations.applicationService';

@Controller('/profile/:user_id/invitations')
@UseFilters(RestfulExceptionFilter)
@UseInterceptors(HttpResponseDecorator)
export default class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsApplicationService,
  ) {}

  @Get()
  public async getInvitations(
    @Param('user_id') userId: number,
    @Query() pagination: PaginatedRequest,
  ): Promise<OFoodResponse<{ invitations: any }>> {
    const [invitations, total] = await this.invitationsService.getInvitations(
      userId,
      pagination,
    );
    return { total, data: { invitations } };
  }

  @Post(':invitation_id')
  public async handleInvitation(
    @Param('invitation_id') invitationId: number,
    @Param('user_id') userId: number,
    @Payload() payload: any,
  ): Promise<OFoodResponse<Record<string, any>>> {
    const result = await this.invitationsService.handleInvitation(
      userId,
      invitationId,
      payload,
    );
    return { data: result };
  }
}
