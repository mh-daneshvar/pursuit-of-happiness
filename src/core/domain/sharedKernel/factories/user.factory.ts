import { Injectable } from '@nestjs/common';
import UsersSchema from '@SecondaryAdapters/db/mysql/schemas/users.schema';
import User from '@Domain/sharedKernel/entities/user.entity';

@Injectable()
export default class UserFactory {
  public buildByMySQLRecord(dbRecord: UsersSchema): User {
    if (!dbRecord) {
      return null;
    }

    const u = new User();
    u.id = dbRecord['id'];
    u.firstname = dbRecord['firstname'];
    u.lastname = dbRecord['lastname'];
    u.username = dbRecord['username'];
    u.mobileNumber = dbRecord['mobileNumber'];
    u.email = dbRecord['email'];
    u.createdAt = dbRecord['createdAt'];
    u.updatedAt = dbRecord['updatedAt'];
    u.tweets = dbRecord['tweets'];
    u.memberships = dbRecord['memberships'];
    return u;
  }
}
