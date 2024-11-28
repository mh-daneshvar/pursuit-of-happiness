import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { HttpStatusCode } from 'axios';
import { PaginatedRequest } from '@Common/utils/paginated.request';
import { RestfulExceptionFilter } from '@Common/filters/restful.exceptionFilter';
import {
  HttpResponseDecorator,
  OFoodResponse,
} from '@Common/decorators/httpResponseDecorator.interceptor';
import InvitationsApplicationService from '@PrimaryAdapters/rest/authors/groups/invitations/invitations.applicationService';
import Invitation from '@Domain/sharedKernel/entities/invitation.entity';

@Controller('/authors/:user_id/groups/:group_id/invitations')
@UseFilters(new RestfulExceptionFilter())
@UseInterceptors(new HttpResponseDecorator())
export default class InvitationsController {
  constructor(
    private readonly invitationsService: InvitationsApplicationService,
  ) {}

  @Get()
  public async getInvitations(
    @Param('user_id') userId: number,
    @Param('group_id') groupId: number,
    @Query() pagination: PaginatedRequest,
  ): Promise<OFoodResponse<{ invitations: Invitation[] }>> {
    const [invitations, total] = await this.invitationsService.getInvitations(
      userId,
      groupId,
      pagination,
    );
    return { total, data: { invitations } };
  }

  @Post()
  public async invite(
    @Param('user_id') userId: number,
    @Param('group_id') groupId: number,
    @Payload() payload: any,
  ): Promise<OFoodResponse<{ invitation: Invitation }>> {
    const invitation = await this.invitationsService.sendInvitation(
      userId,
      groupId,
      payload,
    );
    return { status_code: HttpStatusCode.Created, data: { invitation } };
  }

  @Delete(':invitation_id')
  public async deleteInvitation(
    @Param('user_id') userId: number,
    @Param('group_id') groupId: number,
    @Param('invitation_id') invitationId: number,
  ): Promise<OFoodResponse<void>> {
    await this.invitationsService.cancelInvitation(
      userId,
      groupId,
      invitationId,
    );
    return { status_code: HttpStatusCode.NoContent };
  }
}
