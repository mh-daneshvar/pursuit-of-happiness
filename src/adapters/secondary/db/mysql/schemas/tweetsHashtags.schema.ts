import {
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import TweetsSchema from '@SecondaryAdapters/db/mysql/schemas/tweets.schema';
import HashtagsSchema from '@SecondaryAdapters/db/mysql/schemas/hashtags.schema';

@Entity('tweets_hashtags')
export class TweetsHashtagsSchema {
  @PrimaryColumn({ name: 'tweet_id', type: 'uuid' })
  tweetId: string;

  @PrimaryColumn({ name: 'hashtag_id', type: 'bigint' })
  hashtagId: number;

  @ManyToOne(() => TweetsSchema, { nullable: false })
  @JoinColumn({ name: 'tweet_id' })
  tweet: TweetsSchema;

  @ManyToOne(() => HashtagsSchema, { nullable: false })
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: HashtagsSchema;

  @UpdateDateColumn({
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    onUpdate: 'CURRENT_TIMESTAMP(3)',
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'datetime',
    precision: 3,
    nullable: true,
    default: null,
    name: 'deleted_at',
  })
  deletedAt: Date | null;
}
