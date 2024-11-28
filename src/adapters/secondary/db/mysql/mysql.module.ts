import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import DomainModule from '@Domain/domain.module';
import EventsSchema from '@SecondaryAdapters/db/mysql/schemas/events.schema';
import MembersSchema from '@SecondaryAdapters/db/mysql/schemas/members.schema';
import GroupsSchema from '@SecondaryAdapters/db/mysql/schemas/groups.schema';
import HashtagsSchema from '@SecondaryAdapters/db/mysql/schemas/hashtags.schema';
import InvitationsSchema from '@SecondaryAdapters/db/mysql/schemas/invitations.schema';
import PermissionsSchema from '@SecondaryAdapters/db/mysql/schemas/permissions.schema';
import TweetsSchema from '@SecondaryAdapters/db/mysql/schemas/tweets.schema';
import UsersSchema from '@SecondaryAdapters/db/mysql/schemas/users.schema';
import EventsRepository from '@SecondaryAdapters/db/mysql/repositories/events.repository';
import MembersRepository from '@SecondaryAdapters/db/mysql/repositories/members.repository';
import GroupsRepository from '@SecondaryAdapters/db/mysql/repositories/groups.repository';
import HashtagsRepository from '@SecondaryAdapters/db/mysql/repositories/hashtags.repository';
import InvitationsRepository from '@SecondaryAdapters/db/mysql/repositories/invitations.repository';
import PermissionsRepository from '@SecondaryAdapters/db/mysql/repositories/permissions.repository';
import TweetsRepository from '@SecondaryAdapters/db/mysql/repositories/tweets.repository';
import UsersRepository from '@SecondaryAdapters/db/mysql/repositories/users.repository';
import { TweetsHashtagsSchema } from '@SecondaryAdapters/db/mysql/schemas/tweetsHashtags.schema';
import TweetsHashtagsRepository from '@SecondaryAdapters/db/mysql/repositories/tweetsHashtags.repository';

const entities = [
  UsersSchema,
  TweetsSchema,
  EventsSchema,
  GroupsSchema,
  MembersSchema,
  HashtagsSchema,
  InvitationsSchema,
  PermissionsSchema,
  TweetsHashtagsSchema,
];

const repositories = [
  UsersRepository,
  TweetsRepository,
  EventsRepository,
  GroupsRepository,
  MembersRepository,
  HashtagsRepository,
  InvitationsRepository,
  PermissionsRepository,
  TweetsHashtagsRepository,
];

@Module({
  imports: [DomainModule, TypeOrmModule.forFeature(entities)],
  providers: repositories,
  exports: repositories,
})
export class MysqlModule {}
