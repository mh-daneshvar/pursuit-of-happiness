import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import TweetsSchema from '@SecondaryAdapters/db/mysql/schemas/tweets.schema';

@Entity('hashtags')
export default class HashtagsSchema {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: string;

  @ManyToMany(() => TweetsSchema, (tweet) => tweet.hashtags)
  tweets: TweetsSchema[];

  @Column({
    type: 'varchar',
    unique: true,
    length: 511,
    nullable: false,
    name: 'text',
  })
  text: string;

  @CreateDateColumn({
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    name: 'created_at',
  })
  createdAt: Date;

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
