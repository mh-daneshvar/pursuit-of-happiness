import { Module } from '@nestjs/common';
import DBModule from '@SecondaryAdapters/db/db.module';
import DomainModule from '@Domain/domain.module';
import TweetsController from '@PrimaryAdapters/rest/authors/tweets/tweets.controller';
import TweetsApplicationService from '@PrimaryAdapters/rest/authors/tweets/tweets.applicationService';

@Module({
  imports: [DBModule, DomainModule],
  controllers: [TweetsController],
  providers: [TweetsApplicationService],
})
export default class TweetsModule {}
