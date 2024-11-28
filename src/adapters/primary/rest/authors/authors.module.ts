import { Module } from '@nestjs/common';
import DBModule from '@SecondaryAdapters/db/db.module';
import DomainModule from '@Domain/domain.module';
import GroupsModule from '@PrimaryAdapters/rest/authors/groups/groups.module';
import TweetsModule from '@PrimaryAdapters/rest/authors/tweets/tweets.module';

@Module({
  imports: [DBModule, DomainModule, TweetsModule, GroupsModule],
  controllers: [],
  providers: [],
})
export default class AuthorsModule {}
