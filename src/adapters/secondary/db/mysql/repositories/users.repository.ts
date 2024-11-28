import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UsersSchema from '@SecondaryAdapters/db/mysql/schemas/users.schema';
import User from '@Domain/sharedKernel/entities/user.entity';
import UserFactory from '@Domain/sharedKernel/factories/user.factory';

@Injectable()
export default class UsersRepository {
  constructor(
    @InjectRepository(UsersSchema)
    private readonly usersDAL: Repository<User>,
    private readonly userFactory: UserFactory,
  ) {}

  async findById(userId: number): Promise<User> {
    return await this.usersDAL.findOneBy({ id: userId });
    // return this.userFactory.buildByMySQLRecord(dbRecord);
  }
}
