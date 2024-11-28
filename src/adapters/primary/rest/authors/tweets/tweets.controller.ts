import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { RestfulExceptionFilter } from '@Common/filters/restful.exceptionFilter';
import {
  HttpResponseDecorator,
  OFoodResponse,
} from '@Common/decorators/httpResponseDecorator.interceptor';
import { Payload } from '@nestjs/microservices';
import TweetsApplicationService from '@PrimaryAdapters/rest/authors/tweets/tweets.applicationService';
import { HttpStatusCode } from 'axios';
import Tweet from '@Domain/sharedKernel/entities/tweet.entity';
import { PaginatedRequest } from '@Common/utils/paginated.request';
import { WriteTweetRequest } from '@PrimaryAdapters/rest/authors/tweets/requests/writeTweet.request';

@Controller('/authors/:user_id/tweets')
@UseFilters(RestfulExceptionFilter)
@UseInterceptors(HttpResponseDecorator)
export default class TweetsController {
  constructor(private readonly tas: TweetsApplicationService) {}

  @Get()
  public async getMyTweets(
    @Param('user_id') userId: number,
    @Query() pagination: PaginatedRequest,
  ): Promise<OFoodResponse<{ invitations: any }>> {
    const [invitations, total] = await this.tas.getMyTweets(userId, pagination);
    return { total, data: { invitations } };
  }

  @Get(':tweet_id')
  public async getMyTweet(
    @Param('user_id') userId: number,
    @Param('tweet_id') tweetId: string,
  ): Promise<OFoodResponse<{ tweet: Tweet }>> {
    const tweet = await this.tas.getMyTweet(userId, tweetId);
    return { data: { tweet } };
  }

  @Post()
  @UseFilters(new RestfulExceptionFilter())
  @UseInterceptors(new HttpResponseDecorator())
  public async writeNewTweet(
    @Param('user_id') userId: number,
    @Payload() payload: WriteTweetRequest,
  ): Promise<OFoodResponse<{ tweet: Tweet }>> {
    const tweet = await this.tas.writePostTweet(userId, payload);
    return {
      status_code: HttpStatusCode.Created,
      data: { tweet },
    };
  }

  @Delete(':tweet_id')
  public async deleteMyTweet(
    @Param('user_id') userId: number,
    @Param('tweet_id') tweetId: string,
  ): Promise<OFoodResponse<void>> {
    await this.tas.deleteByAuthor(userId, tweetId);
    return { status_code: HttpStatusCode.NoContent };
  }
}
