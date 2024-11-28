import { Injectable } from '@nestjs/common';
import Group from '@Domain/sharedKernel/entities/group.entity';
import User from '@Domain/sharedKernel/entities/user.entity';

@Injectable()
export default class GroupFactory {
  public buildByCreateNewGroupRequest(
    name: string,
    user: User,
    parent?: Group,
  ): Group {
    const g = new Group();
    g.name = name;
    g.owner = user;
    g.parent = parent ?? null;
    return g;
  }
}
