import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import InternalEventEmitterApplicationService from '@SecondaryAdapters/internalEvents/configs/internalEventEmitter.applicationService';
import TweetsRepository from '@SecondaryAdapters/db/mysql/repositories/tweets.repository';
import TweetFactory from '@Domain/sharedKernel/factories/tweet.factory';
import Tweet from '@Domain/sharedKernel/entities/tweet.entity';
import UsersRepository from '@SecondaryAdapters/db/mysql/repositories/users.repository';
import { TweetType } from '@Domain/sharedKernel/entities/types/tweetType.enum';
import { InternalDomainEvent } from '@Domain/sharedKernel/events/routes/internalDomainEvents.enum';
import TweetCreatedDomainEvent from '@Domain/sharedKernel/events/domain/tweetCreated.domainEvent';
import { PaginatedRequest } from '@Common/utils/paginated.request';
import { WriteTweetRequest } from '@PrimaryAdapters/rest/authors/tweets/requests/writeTweet.request';

@Injectable()
export default class TweetsApplicationService {
  private readonly logger = new Logger(TweetsApplicationService.name);

  constructor(
    private readonly internalEventEmitter: InternalEventEmitterApplicationService,
    private readonly tweetsRepository: TweetsRepository,
    private readonly tweetFactory: TweetFactory,
    private readonly usersRepository: UsersRepository,
  ) {}

  public async getMyTweets(
    userId: number,
    pagination: PaginatedRequest,
  ): Promise<[Tweet[], number]> {
    const author = await this.validateAuthor(userId);
    return this.tweetsRepository.findByAuthor(author, pagination);
  }

  public async getMyTweet(userId: number, tweetId: string): Promise<Tweet> {
    const author = await this.validateAuthor(userId);
    return this.tweetsRepository.findOneByAuthor(author, tweetId);
  }

  public async writePostTweet(
    userId: number,
    payload: WriteTweetRequest,
  ): Promise<Tweet> {
    const author = await this.validateAuthor(userId);
    const parent = await this.validateParentTweet(author, payload.parent_id);

    const tweetObj = this.tweetFactory.buildByWriteTweetRequest(
      TweetType.POST,
      payload,
      parent,
      author,
    );

    const tweet = await this.tweetsRepository.create(tweetObj);
    this.internalEventEmitter.publish(
      InternalDomainEvent.TWEET_CREATED,
      TweetsApplicationService.name,
      new TweetCreatedDomainEvent(
        {
          tweetId: tweet.id,
          hashtags: payload.hashtags,
          permissions: payload.permissions,
        },
        tweet.id,
      ),
    );
    return tweet;
  }

  public async deleteByAuthor(userId: number, tweetId: string): Promise<void> {
    const author = await this.validateAuthor(userId);
    await this.tweetsRepository.deleteByAuthor(author, tweetId);
  }

  private async validateAuthor(userId: number): Promise<any> {
    const author = await this.usersRepository.findById(userId);
    if (!author) {
      throw new UnauthorizedException('User is not authorized');
    }
    return author;
  }

  private async validateParentTweet(
    author: any,
    parentId?: string,
  ): Promise<Tweet | null> {
    if (!parentId) {
      return null;
    }

    const parent = await this.tweetsRepository.findOneByAuthor(
      author,
      parentId,
    );
    if (!parent) {
      throw new NotFoundException('Parent tweet not found');
    }
    return parent;
  }
}
