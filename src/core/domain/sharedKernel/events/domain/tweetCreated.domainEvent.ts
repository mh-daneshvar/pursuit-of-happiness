import LogMessage from '@Common/logMessage.enum';
import BaseEvent from '../base.event';

export default class TweetCreatedDomainEvent extends BaseEvent {
  constructor(payload: Record<string, any>, searchBy: string | number) {
    super(LogMessage.TWEET_CREATED, payload, searchBy);
  }
}
