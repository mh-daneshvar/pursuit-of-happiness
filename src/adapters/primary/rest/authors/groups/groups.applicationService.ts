import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import InternalEventEmitterApplicationService from '@SecondaryAdapters/internalEvents/configs/internalEventEmitter.applicationService';
import { PaginatedRequest } from '@Common/utils/paginated.request';
import GroupsRepository from '@SecondaryAdapters/db/mysql/repositories/groups.repository';
import GroupFactory from '@Domain/sharedKernel/factories/group.factory';
import UsersRepository from '@SecondaryAdapters/db/mysql/repositories/users.repository';
import Group from '@Domain/sharedKernel/entities/group.entity';
import MemberFactory from '@Domain/sharedKernel/factories/memberFactory';
import MembersRepository from '@SecondaryAdapters/db/mysql/repositories/members.repository';

@Injectable()
export default class GroupsApplicationService {
  private readonly logger = new Logger(GroupsApplicationService.name);

  constructor(
    private readonly eventEmitter: InternalEventEmitterApplicationService,
    private readonly groupFactory: GroupFactory,
    private readonly groupsRepo: GroupsRepository,
    private readonly usersRepo: UsersRepository,
    private readonly memberFactory: MemberFactory,
    private readonly membersRepository: MembersRepository,
  ) {}

  public async getMyOwnGroups(
    userId: number,
    pagination: PaginatedRequest,
  ): Promise<[Group[], number]> {
    return this.groupsRepo.findMyOwnGroups(userId, pagination);
  }

  public async getMyOwnSingleGroup(
    userId: number,
    groupId: number,
  ): Promise<Group> {
    const group = await this.groupsRepo.findMyOwnSingleGroup(userId, groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  public async createNewGroup(userId: number, payload: any): Promise<Group> {
    const groupOwner = await this.validateUser(userId);
    const parentGroup = await this.getParentGroup(userId, payload.parent_id);

    const newGroup = await this.groupsRepo.create(
      this.groupFactory.buildByCreateNewGroupRequest(
        payload.name,
        groupOwner,
        parentGroup,
      ),
    );

    if (newGroup) {
      await this.membersRepository.create(
        this.memberFactory.buildByOwner(groupOwner, newGroup),
      );
    }

    return newGroup;
  }

  async updateGroup(
    userId: number,
    groupId: number,
    payload: any,
  ): Promise<Group> {
    const group = await this.getMyOwnSingleGroup(userId, groupId);

    const { name, parent_id: parentId } = payload;
    if (name) {
      group.name = name;
    }
    if (parentId) {
      group.parent = await this.validateAndSetParent(userId, groupId, parentId);
    }

    return this.groupsRepo.update(group);
  }

  async detachParent(userId: number, groupId: number): Promise<Group> {
    const group = await this.getMyOwnSingleGroup(userId, groupId);

    if (group.parent) {
      group.parent = null;
      await this.groupsRepo.update(group);
    }

    return group;
  }

  async deleteGroup(userId: number, groupId: number): Promise<void> {
    const group = await this.getMyOwnSingleGroup(userId, groupId);
    await this.groupsRepo.delete(group);
  }

  private async validateUser(userId: number): Promise<any> {
    const user = await this.usersRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User is not authorized');
    }
    return user;
  }

  private async getParentGroup(
    userId: number,
    parentId?: number,
  ): Promise<Group | null> {
    if (!parentId) {
      return null;
    }

    const parentGroup = await this.groupsRepo.findMyOwnSingleGroup(
      userId,
      parentId,
    );
    if (!parentGroup) {
      throw new NotFoundException('Parent group not found');
    }

    return parentGroup;
  }

  private async validateAndSetParent(
    userId: number,
    groupId: number,
    parentId: number,
  ): Promise<Group> {
    if (parentId === groupId) {
      throw new BadRequestException('A group cannot be its own parent');
    }

    const parentGroup = await this.groupsRepo.findMyOwnSingleGroup(
      userId,
      parentId,
    );
    if (!parentGroup) {
      throw new NotFoundException('Parent group not found');
    }

    return parentGroup;
  }
}
