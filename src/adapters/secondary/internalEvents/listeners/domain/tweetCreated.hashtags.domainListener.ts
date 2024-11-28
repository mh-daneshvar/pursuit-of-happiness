import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import BaseListener from '@SecondaryAdapters/internalEvents/configs/base.listener';
import IBasePayload from '@SecondaryAdapters/internalEvents/configs/base.payload';
import { InternalDomainEvent } from '@Domain/sharedKernel/events/routes/internalDomainEvents.enum';
import HashtagsRepository from '@SecondaryAdapters/db/mysql/repositories/hashtags.repository';
import TweetsRepository from '@SecondaryAdapters/db/mysql/repositories/tweets.repository';
import TweetsHashtagsRepository from '@SecondaryAdapters/db/mysql/repositories/tweetsHashtags.repository';
import Hashtag from '@Domain/sharedKernel/entities/hashtag.entity';
import { TweetHashtag } from '@Domain/sharedKernel/entities/tweetHashtag.entity';

@Injectable()
export default class TweetCreatedHashtagsDomainListener extends BaseListener {
  constructor(
    private readonly tweetsRepository: TweetsRepository,
    private readonly hashtagsRepository: HashtagsRepository,
    private readonly tweetsHashtagsRepository: TweetsHashtagsRepository,
  ) {
    super();
  }

  @OnEvent(InternalDomainEvent.TWEET_CREATED)
  async handle(payload: IBasePayload) {
    const { tweetId, hashtags } = payload?.event?.getDetails();

    if (!hashtags?.length) {
      return;
    }

    const tweet = await this.tweetsRepository.findById(tweetId);
    if (!tweet) {
      throw new Error('tweet not found');
    }

    const hashtagEntities = await Promise.all(
      hashtags.map(async (tag: string) => {
        let hashtag = await this.hashtagsRepository.findByText(tag);
        if (!hashtag) {
          const hashtagObj = new Hashtag();
          hashtagObj.text = tag;
          hashtag = await this.hashtagsRepository.create(hashtagObj);
        }
        return hashtag;
      }),
    );

    for (const hashtag of hashtagEntities) {
      const th = new TweetHashtag();
      th.hashtag = hashtag;
      th.tweet = tweet;
      await this.tweetsHashtagsRepository.create(th);
    }
  }
}
