import { Module } from '@nestjs/common';
import DBModule from '@SecondaryAdapters/db/db.module';
import DomainModule from '@Domain/domain.module';
import InvitationsController from '@PrimaryAdapters/rest/profile/invitations/invitations.controller';
import InvitationsApplicationService from '@PrimaryAdapters/rest/profile/invitations/invitations.applicationService';

@Module({
  imports: [DBModule, DomainModule],
  controllers: [InvitationsController],
  providers: [InvitationsApplicationService],
})
export default class InvitationsModule {}
