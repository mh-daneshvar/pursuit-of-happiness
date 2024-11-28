import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import BaseRepository from '@SecondaryAdapters/db/mysql/repositories/base.repository';
import Permission from '@Domain/sharedKernel/entities/permission.entity';
import PermissionsSchema from '@SecondaryAdapters/db/mysql/schemas/permissions.schema';
import Group from '@Domain/sharedKernel/entities/group.entity';
import { PermittedType } from '@Domain/sharedKernel/entities/types/permittedType.enum';
import Tweet from '@Domain/sharedKernel/entities/tweet.entity';
import User from '@Domain/sharedKernel/entities/user.entity';

@Injectable()
export default class PermissionsRepository extends BaseRepository {
  constructor(
    @InjectRepository(PermissionsSchema)
    private readonly permissionsDAL: Repository<Permission>,
  ) {
    super();
  }

  async create(permission: Permission): Promise<Permission> {
    return this.permissionsDAL.save(permission);
  }

  async findTweetPermissions(tweet: Tweet): Promise<Permission[]> {
    return await this.permissionsDAL.find({
      where: {
        tweet: { id: tweet.id },
      },
      relations: ['tweet', 'group', 'member', 'user'],
    });
  }

  async findTweetPermissionsForUser(
    tweet: Tweet,
    user: User,
  ): Promise<Permission[]> {
    return await this.permissionsDAL.find({
      where: {
        tweet: { id: tweet.id },
        user: { id: user.id },
      },
      relations: ['tweet', 'group', 'member', 'user'],
    });
  }

  async findAllGroupPermissions(group: Group): Promise<Permission[]> {
    return await this.permissionsDAL.find({
      where: {
        permittedType: PermittedType.MEMBERSHIP,
        group: { id: group.id },
        member: IsNull(),
        user: IsNull(),
      },
      relations: ['tweet', 'group', 'member', 'user'],
    });
  }
}
