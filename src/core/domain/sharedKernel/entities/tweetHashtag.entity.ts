import Tweet from './tweet.entity';
import Hashtag from './hashtag.entity';

export class TweetHashtag {
  tweetId: string;
  hashtagId: number;
  tweet: Tweet;
  hashtag: Hashtag;
  updatedAt: Date;
  deletedAt: Date | null;
}
