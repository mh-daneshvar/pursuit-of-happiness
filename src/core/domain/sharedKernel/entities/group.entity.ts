import Member from './member.entity';
import User from '@Domain/sharedKernel/entities/user.entity';
import Permission from '@Domain/sharedKernel/entities/permission.entity';

export default class Group {
  id: number;
  name: string;
  parent: Group | null;
  owner: User;
  members: Member[];
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
