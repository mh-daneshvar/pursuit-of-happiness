import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import BaseListener from '@SecondaryAdapters/internalEvents/configs/base.listener';
import IBasePayload from '@SecondaryAdapters/internalEvents/configs/base.payload';
import { InternalDomainEvent } from '@Domain/sharedKernel/events/routes/internalDomainEvents.enum';
import TweetsRepository from '@SecondaryAdapters/db/mysql/repositories/tweets.repository';
import GroupsRepository from '@SecondaryAdapters/db/mysql/repositories/groups.repository';
import PermissionsRepository from '@SecondaryAdapters/db/mysql/repositories/permissions.repository';
import PermissionFactory from '@Domain/sharedKernel/factories/permission.factory';
import { PermissionType } from '@Domain/sharedKernel/entities/types/permissionType.enum';
import UsersRepository from '@SecondaryAdapters/db/mysql/repositories/users.repository';
import MembersRepository from '@SecondaryAdapters/db/mysql/repositories/members.repository';
import Tweet from '@Domain/sharedKernel/entities/tweet.entity';
import Permission from '@Domain/sharedKernel/entities/permission.entity';
import Member from '@Domain/sharedKernel/entities/member.entity';
import Group from '@Domain/sharedKernel/entities/group.entity';
import { PermittedType } from '@Domain/sharedKernel/entities/types/permittedType.enum';

@Injectable()
export default class TweetCreatedPermissionsDomainListener extends BaseListener {
  constructor(
    private readonly permissionsRepository: PermissionsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly tweetsRepository: TweetsRepository,
    private readonly permissionFactory: PermissionFactory,
    private readonly usersRepository: UsersRepository,
    private readonly membersRepository: MembersRepository,
  ) {
    super();
  }

  @OnEvent(InternalDomainEvent.TWEET_CREATED)
  async handle(payload: IBasePayload) {
    const { tweetId, permissions } = payload?.event?.getDetails();

    if (!permissions) {
      return;
    }

    const tweet = await this.tweetsRepository.findById(tweetId);
    if (!tweet) {
      throw new Error('Tweet not found');
    }

    if (permissions?.inherited && tweet.parent) {
      await this.handleInheritedPermissions(tweet, permissions);
    } else {
      await this.handleDirectPermissions(tweet, permissions);
    }
  }

  private async handleInheritedPermissions(
    tweet: Tweet,
    permissions: Record<string, any>,
  ) {
    const parentTweet = await this.tweetsRepository.findOneByAuthor(
      tweet.author,
      tweet.parent,
    );
    if (!parentTweet) {
      return;
    }

    const parentPermissions =
      await this.permissionsRepository.findTweetPermissions(parentTweet);
    if (parentPermissions.length === 0) {
      return;
    }

    const allowedInheritedPermissionTypes =
      this.getAllowedInheritedPermissionTypes(permissions);

    await this.applyInheritedPermissions(
      parentPermissions,
      allowedInheritedPermissionTypes,
      tweet,
    );
  }

  private getAllowedInheritedPermissionTypes(
    permissions: Record<string, any>,
  ): PermissionType[] {
    const allowedTypes: PermissionType[] = [];
    if (permissions.inherited?.view) allowedTypes.push(PermissionType.VIEW);
    if (permissions.inherited?.edit) allowedTypes.push(PermissionType.EDIT);
    return allowedTypes;
  }

  private async applyInheritedPermissions(
    parentPermissions: Permission[],
    allowedInheritedPermissionTypes: PermissionType[],
    tweet: Tweet,
  ) {
    for (const permission of parentPermissions) {
      if (allowedInheritedPermissionTypes.includes(permission.type)) {
        const clonedPermission = this.permissionFactory.cloneTweetPermission(
          permission,
          tweet,
        );
        await this.permissionsRepository.create(clonedPermission);
      }
    }
  }

  private async handleDirectPermissions(
    tweet: Tweet,
    permissions: Record<string, any>,
  ) {
    await this.processPermissions(
      tweet,
      permissions?.view,
      PermissionType.VIEW,
    );
    await this.processPermissions(
      tweet,
      permissions?.edit,
      PermissionType.EDIT,
    );
  }

  private async processPermissions(
    tweet: Tweet,
    permissionDetails: Record<string, any>,
    permissionType: PermissionType,
  ) {
    if (!permissionDetails) {
      return;
    }

    const { users, groups } = permissionDetails;
    if (Array.isArray(users)) {
      await this.assignIndividualPermissions(users, tweet, permissionType);
    }
    if (Array.isArray(groups)) {
      await this.assignMembershipPermissions(groups, tweet, permissionType);
    }
  }

  private async assignIndividualPermissions(
    userIds: number[],
    tweet: Tweet,
    permissionType: PermissionType,
  ) {
    for (const userId of userIds) {
      const user = await this.usersRepository.findById(userId);
      const permission = this.permissionFactory.buildIndividualPermission(
        user,
        tweet,
        permissionType,
      );
      await this.permissionsRepository.create(permission);
    }
  }

  private async assignMembershipPermissions(
    groupIds: number[],
    tweet: Tweet,
    permissionType: PermissionType,
  ) {
    for (const groupId of groupIds) {
      const group = await this.groupsRepository.findById(groupId);
      if (!group) {
        continue;
      }

      const members =
        await this.membersRepository.findMembersByGroupId(groupId);

      await this.createGroupPermissionsForMembers(
        members,
        group,
        tweet,
        permissionType,
      );

      await this.createDefaultGroupPermission(group, tweet, permissionType);
    }
  }

  private async createGroupPermissionsForMembers(
    members: Member[],
    group: Group,
    tweet: Tweet,
    permissionType: PermissionType,
  ): Promise<Permission> {
    let permission: Permission;
    for (const member of members) {
      permission = this.permissionFactory.buildMembershipPermission(
        member.user,
        tweet,
        permissionType,
        group,
        member,
      );
      await this.permissionsRepository.create(permission);
    }
    return permission;
  }

  private async createDefaultGroupPermission(
    group: Group,
    tweet: Tweet,
    permissionType: PermissionType,
  ) {
    const permission = new Permission();
    permission.group = group;
    permission.tweet = tweet;
    permission.type = permissionType;
    permission.permittedType = PermittedType.MEMBERSHIP;
    await this.permissionsRepository.create(permission);
  }
}
