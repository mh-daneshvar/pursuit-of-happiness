import Tweet from './tweet.entity';

export default class Hashtag {
  id: string;
  tweets: Tweet[];
  text: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
