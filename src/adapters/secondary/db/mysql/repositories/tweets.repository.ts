import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import TweetsSchema from '@SecondaryAdapters/db/mysql/schemas/tweets.schema';
import Tweet from '@Domain/sharedKernel/entities/tweet.entity';
import { PermissionType } from '@Domain/sharedKernel/entities/types/permissionType.enum';
import User from '@Domain/sharedKernel/entities/user.entity';
import BaseRepository from '@SecondaryAdapters/db/mysql/repositories/base.repository';
import { PaginatedRequest } from '@Common/utils/paginated.request';
import { TweetCategory } from '@Domain/sharedKernel/entities/types/tweetCategory.enum';

@Injectable()
export default class TweetsRepository extends BaseRepository {
  constructor(
    @InjectRepository(TweetsSchema)
    private readonly tweetsDAL: Repository<Tweet>,
  ) {
    super();
  }

  async create(tweet: Tweet): Promise<Tweet> {
    return this.tweetsDAL.save(tweet);
  }

  public async findById(tweetId: string): Promise<Tweet> {
    return await this.tweetsDAL.findOne({
      where: { id: tweetId },
      relations: ['parent', 'author', 'permissions', 'hashtags'],
    });
  }

  public async findOneByAuthor(
    author: User,
    tweet: Tweet | string,
  ): Promise<Tweet | null> {
    const tweetId = typeof tweet === 'string' ? tweet : tweet['id'];
    if (!tweetId) {
      return null;
    }

    return await this.tweetsDAL.findOne({
      where: {
        author: { id: author.id },
        id: tweetId,
      },
      relations: ['parent', 'permissions', 'hashtags'],
    });
  }

  public async deleteByAuthor(author: User, tweetId: string): Promise<void> {
    await this.tweetsDAL.softDelete({
      author: { id: author.id },
      id: tweetId,
    });
  }

  public async findByAuthor(
    author: User,
    pagination: PaginatedRequest,
  ): Promise<[Tweet[], number]> {
    const [take, skip] = this.preparePagination(pagination);
    return this.tweetsDAL.findAndCount({
      where: {
        author: { id: author.id },
      },
      relations: ['parent'],
      order: {
        createdAt: 'DESC',
      },
      take,
      skip,
    });
  }

  public async getVisibleTweetsForUser(
    userId: number,
    filters: {
      location?: string;
      authorId?: number;
      category?: TweetCategory;
      parentId?: string | null;
      hashtag?: string;
    } = {},
    pagination: PaginatedRequest,
  ): Promise<[Tweet[], number]> {
    const { location, authorId, category, parentId, hashtag } = filters;
    const [take, skip] = this.preparePagination(pagination);

    const queryBuilder = this.tweetsDAL
      .createQueryBuilder('t')
      .leftJoinAndSelect(
        't.permissions',
        'p',
        'p.deletedAt IS NULL AND p.type = :permissionType',
        {
          permissionType: PermissionType.VIEW,
        },
      )
      .leftJoin('t.parent', 'parent')
      .addSelect(['parent.id', 'parent.createdAt'])
      .leftJoin('t.author', 'author')
      .addSelect(['author.id', 'author.username'])
      .leftJoin('t.hashtags', 'hashtag')
      .addSelect(['hashtag.id', 'hashtag.text'])
      .where('t.author.id != :userId', { userId })
      .andWhere('t.deletedAt IS NULL')
      .andWhere(
        new Brackets((qb) => {
          qb.where('p.id IS NULL').orWhere('p.user.id = :userId', { userId });
        }),
      );

    if (location) {
      queryBuilder.andWhere('t.location = :location', { location });
    }

    if (authorId) {
      queryBuilder.andWhere('t.author.id = :authorId', { authorId });
    }

    if (category) {
      queryBuilder.andWhere('t.category = :category', { category });
    }

    if (parentId && parentId.length > 0) {
      queryBuilder.andWhere('t.parent.id = :parentId', { parentId });
    } else {
      queryBuilder.andWhere('t.parent IS NULL');
    }

    if (hashtag) {
      queryBuilder.andWhere('hashtag.text = :hashtag', { hashtag });
    }

    queryBuilder.orderBy('t.createdAt', 'DESC').take(take).skip(skip);

    return queryBuilder.getManyAndCount();
  }
}
