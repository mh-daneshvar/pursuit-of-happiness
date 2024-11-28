import { Injectable } from '@nestjs/common';
import Tweet from '@Domain/sharedKernel/entities/tweet.entity';
import User from '@Domain/sharedKernel/entities/user.entity';
import Permission from '@Domain/sharedKernel/entities/permission.entity';
import Hashtag from '@Domain/sharedKernel/entities/hashtag.entity';
import { TweetType } from '@Domain/sharedKernel/entities/types/tweetType.enum';
import { TweetCategory } from '@Domain/sharedKernel/entities/types/tweetCategory.enum';
import { WriteTweetRequest } from '@PrimaryAdapters/rest/authors/tweets/requests/writeTweet.request';

@Injectable()
export default class TweetFactory {
  public buildByWriteTweetRequest(
    type: TweetType,
    payload: WriteTweetRequest,
    parent: Tweet,
    author: User,
    permissions: Permission[] = [],
    hashtags: Hashtag[] = [],
  ): Tweet {
    if (!payload) {
      return null;
    }

    const t = new Tweet();
    t.content = payload.content;
    t.location = payload.location;
    t.inheritViewPermissions = payload.permissions?.inherited?.view ?? false;
    t.inheritEditPermissions = payload.permissions?.inherited?.edit ?? false;
    t.category = TweetCategory[payload.category];
    t.type = type;
    t.parent = parent;
    t.author = author;
    t.permissions = permissions;
    t.hashtags = hashtags;
    return t;
  }
}
