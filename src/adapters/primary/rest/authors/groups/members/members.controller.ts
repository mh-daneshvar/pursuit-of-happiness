import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { PaginatedRequest } from '@Common/utils/paginated.request';
import { RestfulExceptionFilter } from '@Common/filters/restful.exceptionFilter';
import {
  HttpResponseDecorator,
  OFoodResponse,
} from '@Common/decorators/httpResponseDecorator.interceptor';
import MembersApplicationService from '@PrimaryAdapters/rest/authors/groups/members/members.applicationService';

@Controller('/authors/:user_id/groups/:group_id/members')
export default class MembersController {
  constructor(private readonly mas: MembersApplicationService) {}

  @Get()
  @UseFilters(new RestfulExceptionFilter())
  @UseInterceptors(new HttpResponseDecorator())
  public async getInvitations(
    @Param('user_id') userId: number,
    @Param('group_id') groupId: number,
    @Query() pagination: PaginatedRequest,
  ): Promise<OFoodResponse<{ groups: any }>> {
    const [groups, total] = await this.mas.getActiveMembers(
      userId,
      groupId,
      pagination,
    );
    return {
      total,
      data: { groups },
    };
  }

  @Delete(':member_id')
  @UseFilters(new RestfulExceptionFilter())
  @UseInterceptors(new HttpResponseDecorator())
  public async deleteMember(
    @Param('user_id') userId: number,
    @Param('group_id') groupId: number,
    @Param('member_id') memberId: number,
  ): Promise<OFoodResponse<any>> {
    await this.mas.deleteMember(userId, groupId, memberId);
    return {
      status_code: HttpStatusCode.NoContent,
    };
  }
}
