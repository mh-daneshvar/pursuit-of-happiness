import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import InternalEventEmitterApplicationService from '@SecondaryAdapters/internalEvents/configs/internalEventEmitter.applicationService';
import { PaginatedRequest } from '@Common/utils/paginated.request';
import TweetsRepository from '@SecondaryAdapters/db/mysql/repositories/tweets.repository';
import UsersRepository from '@SecondaryAdapters/db/mysql/repositories/users.repository';
import PermissionsRepository from '@SecondaryAdapters/db/mysql/repositories/permissions.repository';
import { PermissionType } from '@Domain/sharedKernel/entities/types/permissionType.enum';
import User from '@Domain/sharedKernel/entities/user.entity';
import Tweet from '@Domain/sharedKernel/entities/tweet.entity';
import { FeedsRequest } from '@PrimaryAdapters/rest/public/timeline/requests/feeds.request';

@Injectable()
export default class TimelineApplicationService {
  private readonly logger = new Logger(TimelineApplicationService.name);

  constructor(
    private readonly internalEventEmitter: InternalEventEmitterApplicationService,
    private readonly usersRepository: UsersRepository,
    private readonly tweetsRepository: TweetsRepository,
    private readonly permissionsRepository: PermissionsRepository,
  ) {}

  public async getTweets(
    userId: number,
    query: FeedsRequest,
    pagination: PaginatedRequest,
  ): Promise<[Tweet[], number]> {
    const filters = {
      location: query.location,
      authorId: +query.author_id,
      category: query.category,
      parentId: query.parent_tweet_id,
      hashtag: query.hashtag,
    };

    return this.tweetsRepository.getVisibleTweetsForUser(
      userId,
      filters,
      pagination,
    );
  }

  public async getAvailableActions(
    userId: number,
    tweetId: string,
  ): Promise<{ visitable: boolean; editable: boolean }> {
    const user = await this.getUserById(userId);
    const tweet = await this.getTweetById(tweetId);

    if (this.isAuthor(user, tweet)) {
      return { visitable: true, editable: true };
    }

    return this.evaluatePermissions(user, tweet);
  }

  private async getUserById(userId: number): Promise<any> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User is not authorized');
    }
    return user;
  }

  private async getTweetById(tweetId: string): Promise<any> {
    const tweet = await this.tweetsRepository.findById(tweetId);
    if (!tweet) {
      throw new NotFoundException('Tweet not found');
    }
    return tweet;
  }

  private isAuthor(user: User, tweet: Tweet): boolean {
    return user.id === tweet.author?.id;
  }

  private async evaluatePermissions(
    user: User,
    tweet: Tweet,
  ): Promise<{ visitable: boolean; editable: boolean }> {
    const permissions =
      await this.permissionsRepository.findTweetPermissionsForUser(tweet, user);

    const visitable = permissions.some(
      (permission) => permission.type === PermissionType.VIEW,
    );
    const editable = permissions.some(
      (permission) => permission.type === PermissionType.EDIT,
    );

    return { visitable, editable };
  }
}
