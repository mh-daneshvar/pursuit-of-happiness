import { Module } from '@nestjs/common';
import DBModule from '@SecondaryAdapters/db/db.module';
import DomainModule from '@Domain/domain.module';
import GroupsController from '@PrimaryAdapters/rest/authors/groups/groups.controller';
import GroupsApplicationService from '@PrimaryAdapters/rest/authors/groups/groups.applicationService';
import InvitationsModule from '@PrimaryAdapters/rest/authors/groups/invitations/invitations.module';
import MembersModule from '@PrimaryAdapters/rest/authors/groups/members/members.module';

@Module({
  imports: [DBModule, DomainModule, InvitationsModule, MembersModule],
  controllers: [GroupsController],
  providers: [GroupsApplicationService],
})
export default class GroupsModule {}
