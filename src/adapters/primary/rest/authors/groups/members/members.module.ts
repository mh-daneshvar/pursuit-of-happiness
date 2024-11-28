import { Module } from '@nestjs/common';
import DBModule from '@SecondaryAdapters/db/db.module';
import DomainModule from '@Domain/domain.module';
import MembersController from '@PrimaryAdapters/rest/authors/groups/members/members.controller';
import MembersApplicationService from '@PrimaryAdapters/rest/authors/groups/members/members.applicationService';

@Module({
  imports: [DBModule, DomainModule],
  controllers: [MembersController],
  providers: [MembersApplicationService],
})
export default class MembersModule {}
