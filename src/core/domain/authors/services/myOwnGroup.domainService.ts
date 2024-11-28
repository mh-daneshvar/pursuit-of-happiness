import Group from '@Domain/sharedKernel/entities/group.entity';
import { User } from '@sentry/node';

export default class MyOwnGroupDomainService {
  public checkOwnership(user: User, group: Group): boolean {
    return group.owner === user;
  }
}
