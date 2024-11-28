import { PermissionType } from '@Domain/sharedKernel/entities/types/permissionType.enum';
import { PermittedType } from '@Domain/sharedKernel/entities/types/permittedType.enum';
import Tweet from './tweet.entity';
import Group from './group.entity';
import User from './user.entity';
import Member from './member.entity';

export default class Permission {
  id: number;
  type: PermissionType;
  permittedType: PermittedType;
  tweet: Tweet;
  group: Group;
  user: User;
  member: Member;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
