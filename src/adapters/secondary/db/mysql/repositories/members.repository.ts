import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import BaseRepository from '@SecondaryAdapters/db/mysql/repositories/base.repository';
import MembersSchema from '@SecondaryAdapters/db/mysql/schemas/members.schema';
import Member from '@Domain/sharedKernel/entities/member.entity';

@Injectable()
export default class MembersRepository extends BaseRepository {
  constructor(
    @InjectRepository(MembersSchema)
    private readonly membersDAL: Repository<Member>,
  ) {
    super();
  }

  async create(member: Member): Promise<Member> {
    return this.membersDAL.save(member);
  }

  // async update(permission: Permission): Promise<Permission> {
  //   await this.permissionsRepository.update(
  //     { id: permission.id },
  //     { name: permission.name },
  //   );
  //   return this.findMyOwnSinglePermission(permission.owner.id, permission.id);
  // }
  //
  // async delete(permission: Permission): Promise<boolean> {
  //   const result = await this.permissionsRepository.softDelete({
  //     id: permission.id,
  //   });
  //   return result.affected === 1;
  // }
  //

  async findMembersByGroupId(groupId: number): Promise<Member[]> {
    return await this.membersDAL.find({
      where: { group: { id: groupId } },
      relations: ['user', 'group'],
    });
  }
}
