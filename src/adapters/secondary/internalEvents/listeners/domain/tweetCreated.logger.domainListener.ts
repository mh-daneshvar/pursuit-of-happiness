import { OnEvent } from '@nestjs/event-emitter';
import BaseListener from '@SecondaryAdapters/internalEvents/configs/base.listener';
import IBasePayload from '@SecondaryAdapters/internalEvents/configs/base.payload';
import { Injectable } from '@nestjs/common';
import { InternalDomainEvent } from '@Domain/sharedKernel/events/routes/internalDomainEvents.enum';

@Injectable()
export default class TweetCreatedLoggerDomainListener extends BaseListener {
  @OnEvent(InternalDomainEvent.TWEET_CREATED)
  public async handle(payload: IBasePayload): Promise<void> {
    super.logInfo(payload);
  }
}
