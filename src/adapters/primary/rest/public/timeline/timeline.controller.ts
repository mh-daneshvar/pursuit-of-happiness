import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { PaginatedRequest } from '@Common/utils/paginated.request';
import { RestfulExceptionFilter } from '@Common/filters/restful.exceptionFilter';
import {
  HttpResponseDecorator,
  OFoodResponse,
} from '@Common/decorators/httpResponseDecorator.interceptor';
import TimelineApplicationService from '@PrimaryAdapters/rest/public/timeline/timeline.applicationService';
import { FeedsRequest } from '@PrimaryAdapters/rest/public/timeline/requests/feeds.request';
import Tweet from '@Domain/sharedKernel/entities/tweet.entity';

@Controller('/public')
export default class TimelineController {
  constructor(private readonly tlas: TimelineApplicationService) {}

  @Get('wassup/:user_id')
  @UseFilters(new RestfulExceptionFilter())
  @UseInterceptors(new HttpResponseDecorator())
  public async getInvitations(
    @Param('user_id') userId: number,
    @Query() query: FeedsRequest,
    @Query() pagination: PaginatedRequest,
  ): Promise<OFoodResponse<{ feeds: Tweet[] }>> {
    const [feeds, total] = await this.tlas.getTweets(userId, query, pagination);
    return {
      total,
      data: { feeds },
    };
  }

  @Get('wassup/:user_id/tweets/:tweet_id/actions')
  @UseFilters(new RestfulExceptionFilter())
  @UseInterceptors(new HttpResponseDecorator())
  public async checkVisibility(
    @Param('user_id') userId: number,
    @Param('tweet_id') tweetId: string,
  ): Promise<OFoodResponse<Record<string, any>>> {
    const available_actions = await this.tlas.getAvailableActions(
      userId,
      tweetId,
    );
    return {
      data: {
        available_actions,
      },
    };
  }
}
