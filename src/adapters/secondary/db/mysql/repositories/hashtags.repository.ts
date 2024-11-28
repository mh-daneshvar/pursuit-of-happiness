import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import HashtagsSchema from '@SecondaryAdapters/db/mysql/schemas/hashtags.schema';
import Hashtag from '@Domain/sharedKernel/entities/hashtag.entity';

@Injectable()
export default class HashtagsRepository {
  constructor(
    @InjectRepository(HashtagsSchema)
    private readonly hashtagsDAL: Repository<Hashtag>,
  ) {}

  async create(hashtag: Hashtag): Promise<Hashtag> {
    return this.hashtagsDAL.save(hashtag);
  }

  async findByText(text: string): Promise<Hashtag> {
    return await this.hashtagsDAL.findOneBy({
      text,
    });
  }
}
