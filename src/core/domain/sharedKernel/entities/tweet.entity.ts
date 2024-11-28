import { TweetType } from '@Domain/sharedKernel/entities/types/tweetType.enum';
import { TweetCategory } from '@Domain/sharedKernel/entities/types/tweetCategory.enum';
import User from './user.entity';
import Permission from './permission.entity';
import Hashtag from './hashtag.entity';

export default class Tweet {
  id: string;
  content: string;
  location: string | null;
  type: TweetType;
  category: TweetCategory;
  inheritViewPermissions: boolean;
  inheritEditPermissions: boolean;
  parent: Tweet | null;
  author: User;
  permissions: Permission[];
  hashtags: Hashtag[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
