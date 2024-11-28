import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import GroupsApplicationService from '@PrimaryAdapters/rest/authors/groups/groups.applicationService';
import Group from '@Domain/sharedKernel/entities/group.entity';

@Controller('/authors/:user_id/groups')
@UseFilters(new RestfulExceptionFilter())
@UseInterceptors(new HttpResponseDecorator())
export default class GroupsController {
  constructor(private readonly groupsService: GroupsApplicationService) {}

  @Get()
  public async getMyGroups(
    @Param('user_id') userId: number,
    @Query() pagination: PaginatedRequest,
  ): Promise<OFoodResponse<{ groups: any }>> {
    const [groups, total] = await this.groupsService.getMyOwnGroups(
      userId,
      pagination,
    );
    return { total, data: { groups } };
  }

  @Get(':group_id')
  public async getGroup(
    @Param('user_id') userId: number,
    @Param('group_id') groupId: number,
  ): Promise<OFoodResponse<{ group: any }>> {
    const group = await this.groupsService.getMyOwnSingleGroup(userId, groupId);
    return { data: { group } };
  }

  @Post()
  public async createGroup(
    @Param('user_id') userId: number,
    @Payload() payload: any,
  ): Promise<OFoodResponse<{ group: any }>> {
    const newGroup = await this.groupsService.createNewGroup(userId, payload);
    return {
      status_code: HttpStatusCode.Created,
      data: { group: newGroup },
    };
  }

  @Patch(':group_id')
  public async updateGroup(
    @Param('user_id') userId: number,
    @Param('group_id') groupId: number,
    @Payload() payload: any,
  ): Promise<OFoodResponse<{ group: any }>> {
    const updatedGroup = await this.groupsService.updateGroup(
      userId,
      groupId,
      payload,
    );
    return { data: { group: updatedGroup } };
  }

  @Patch(':group_id/detach-parent')
  public async detachParent(
    @Param('user_id') userId: number,
    @Param('group_id') groupId: number,
  ): Promise<OFoodResponse<{ group: Group }>> {
    const updatedGroup = await this.groupsService.detachParent(userId, groupId);
    return {
      data: { group: updatedGroup },
    };
  }

  @Delete(':group_id')
  public async deleteGroup(
    @Param('user_id') userId: number,
    @Param('group_id') groupId: number,
  ): Promise<OFoodResponse<void>> {
    await this.groupsService.deleteGroup(userId, groupId);
    return { status_code: HttpStatusCode.NoContent };
  }
}
