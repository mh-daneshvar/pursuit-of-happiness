import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TweetsHashtagsSchema } from '@SecondaryAdapters/db/mysql/schemas/tweetsHashtags.schema';
import { TweetHashtag } from '@Domain/sharedKernel/entities/tweetHashtag.entity';

@Injectable()
export default class TweetsHashtagsRepository {
  constructor(
    @InjectRepository(TweetsHashtagsSchema)
    private readonly tweetsHashtagsDAL: Repository<TweetHashtag>,
  ) {}

  async create(tweet: TweetHashtag): Promise<TweetHashtag> {
    return this.tweetsHashtagsDAL.save(tweet);
  }
}
