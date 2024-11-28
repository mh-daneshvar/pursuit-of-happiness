import Group from './group.entity';
import User from './user.entity';

export default class Member {
  id: number;
  group: Group;
  user: User;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
