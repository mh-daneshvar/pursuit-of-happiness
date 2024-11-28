import { Injectable } from '@nestjs/common';
import Permission from '@Domain/sharedKernel/entities/permission.entity';
import Member from '@Domain/sharedKernel/entities/member.entity';
import Tweet from '@Domain/sharedKernel/entities/tweet.entity';
import { PermittedType } from '@Domain/sharedKernel/entities/types/permittedType.enum';
import { PermissionType } from '@Domain/sharedKernel/entities/types/permissionType.enum';
import User from '@Domain/sharedKernel/entities/user.entity';
import Group from '@Domain/sharedKernel/entities/group.entity';

@Injectable()
export default class PermissionFactory {
  public buildIndividualPermission(
    user: User,
    tweet: Tweet,
    type: PermissionType,
  ): Permission {
    const p = new Permission();
    p.type = type;
    p.permittedType = PermittedType.INDIVIDUAL;
    p.tweet = tweet;
    p.user = user;
    p.group = null;
    p.member = null;
    return p;
  }

  public buildMembershipPermission(
    user: User,
    tweet: Tweet,
    type: PermissionType,
    group: Group,
    member: Member,
  ): Permission {
    const p = new Permission();
    p.type = type;
    p.permittedType = PermittedType.MEMBERSHIP;
    p.tweet = tweet;
    p.user = user;
    p.group = group;
    p.member = member;
    return p;
  }

  public cloneGroupPermission(
    member: Member,
    groupPermission: Permission,
  ): Permission {
    const p = new Permission();
    p.type = groupPermission.type;
    p.permittedType = groupPermission.permittedType;
    p.tweet = groupPermission.tweet;
    p.group = member.group;
    p.user = member.user;
    p.member = member;
    return p;
  }

  public cloneTweetPermission(
    permission: Permission,
    tweet: Tweet,
  ): Permission {
    const clone = new Permission();
    clone.type = permission.type;
    clone.permittedType = permission.permittedType;
    clone.tweet = tweet;
    clone.group = permission.group;
    clone.user = permission.user;
    clone.member = permission.member;
    return clone;
  }
}
