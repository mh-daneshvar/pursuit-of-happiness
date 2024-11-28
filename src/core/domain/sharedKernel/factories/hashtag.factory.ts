import { Injectable } from '@nestjs/common';
import HashtagsSchema from '@SecondaryAdapters/db/mysql/schemas/hashtags.schema';
import Hashtag from '@Domain/sharedKernel/entities/hashtag.entity';

@Injectable()
export default class HashtagFactory {
  public buildByMySQLRecord(dbRecord: HashtagsSchema): Hashtag {
    if (!dbRecord) {
      return null;
    }
    return new Hashtag();
  }
}
