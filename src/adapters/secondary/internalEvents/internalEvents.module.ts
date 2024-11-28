import { Global, Module } from '@nestjs/common';
import DBModule from '@SecondaryAdapters/db/db.module';
import DomainModule from '@Domain/domain.module';
import InternalEventEmitterApplicationService from '@SecondaryAdapters/internalEvents/configs/internalEventEmitter.applicationService';
import { EventEmitterModule } from '@nestjs/event-emitter';
import TweetCreatedLoggerDomainListener from '@SecondaryAdapters/internalEvents/listeners/domain/tweetCreated.logger.domainListener';
import TweetCreatedHashtagsDomainListener from '@SecondaryAdapters/internalEvents/listeners/domain/tweetCreated.hashtags.domainListener';
import TweetCreatedPermissionsDomainListener from '@SecondaryAdapters/internalEvents/listeners/domain/tweetCreated.permissions.domainListener';

const DOMAIN_LISTENERS = [
  TweetCreatedLoggerDomainListener,
  TweetCreatedHashtagsDomainListener,
  TweetCreatedPermissionsDomainListener,
];
const INTEGRATION_LISTENERS = [];

@Global()
@Module({
  imports: [EventEmitterModule.forRoot(), DomainModule, DBModule],
  providers: [
    InternalEventEmitterApplicationService,
    ...DOMAIN_LISTENERS,
    ...INTEGRATION_LISTENERS,
  ],
  exports: [InternalEventEmitterApplicationService],
})
export default class InternalEventsModule {}
