import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { TweetCategory } from '@Domain/sharedKernel/entities/types/tweetCategory.enum';

export class FeedsRequest {
  @IsOptional()
  @IsNumberString()
  author_id?: number;

  @IsOptional()
  @IsString()
  hashtag?: string;

  @IsOptional()
  @IsString()
  parent_tweet_id?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(TweetCategory, {
    message: 'Category must be one of the following values: NEWS, SPORT',
  })
  category?: TweetCategory;

  @IsOptional()
  @IsString()
  location?: string;
}
