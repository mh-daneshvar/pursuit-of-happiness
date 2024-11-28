import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import GroupsSchema from '@SecondaryAdapters/db/mysql/schemas/groups.schema';
import Group from '@Domain/sharedKernel/entities/group.entity';
import BaseRepository from '@SecondaryAdapters/db/mysql/repositories/base.repository';
import { PaginatedRequest } from '@Common/utils/paginated.request';

@Injectable()
export default class GroupsRepository extends BaseRepository {
  constructor(
    @InjectRepository(GroupsSchema)
    private readonly groupsDAL: Repository<Group>,
  ) {
    super();
  }

  async create(group: Group): Promise<Group> {
    return this.groupsDAL.save(group);
  }

  async update(group: Group): Promise<Group> {
    await this.groupsDAL.update(
      { id: group.id },
      {
        name: group.name,
        parent: group.parent,
      },
    );
    return this.findMyOwnSingleGroup(group.owner.id, group.id);
  }

  async delete(group: Group): Promise<boolean> {
    const result = await this.groupsDAL.softDelete({ id: group.id });
    return result.affected === 1;
  }

  async findById(groupId: number): Promise<Group> {
    return await this.groupsDAL.findOne({
      where: { id: groupId },
      relations: ['parent'],
    });
  }

  async findMyOwnGroups(
    userId: number,
    pagination: PaginatedRequest,
  ): Promise<[Group[], number]> {
    const [take, skip] = this.preparePagination(pagination);
    return await this.groupsDAL.findAndCount({
      where: { owner: { id: userId } },
      relations: ['parent'],
      take,
      skip,
    });
  }

  async findMyOwnSingleGroup(userId: number, groupId: number): Promise<Group> {
    return await this.groupsDAL.findOne({
      where: { id: groupId, owner: { id: userId } },
      relations: ['owner', 'parent', 'members'],
    });
  }
}
