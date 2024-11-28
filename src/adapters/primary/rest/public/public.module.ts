import { Module } from '@nestjs/common';
import DBModule from '@SecondaryAdapters/db/db.module';
import DomainModule from '@Domain/domain.module';
import InvitationsModule from '@PrimaryAdapters/rest/profile/invitations/invitations.module';
import TimelineController from '@PrimaryAdapters/rest/public/timeline/timeline.controller';
import TimelineApplicationService from '@PrimaryAdapters/rest/public/timeline/timeline.applicationService';

@Module({
  imports: [DBModule, DomainModule, InvitationsModule],
  controllers: [TimelineController],
  providers: [TimelineApplicationService],
})
export default class PublicModule {}
