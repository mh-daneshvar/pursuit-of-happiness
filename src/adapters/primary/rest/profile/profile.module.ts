import { Module } from '@nestjs/common';
import DBModule from '@SecondaryAdapters/db/db.module';
import DomainModule from '@Domain/domain.module';
import InvitationsModule from '@PrimaryAdapters/rest/profile/invitations/invitations.module';

@Module({
  imports: [DBModule, DomainModule, InvitationsModule],
  controllers: [],
  providers: [],
})
export default class ProfileModule {}
