import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import PermissionsSchema from './permissions.schema';
import { TweetType } from '@Domain/sharedKernel/entities/types/tweetType.enum';
import { TweetCategory } from '@Domain/sharedKernel/entities/types/tweetCategory.enum';
import HashtagsSchema from '@SecondaryAdapters/db/mysql/schemas/hashtags.schema';
import UsersSchema from '@SecondaryAdapters/db/mysql/schemas/users.schema';

@Entity('tweets')
export default class TweetsSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
    name: 'content',
  })
  content: string;

  @Column({
    type: 'text',
    nullable: false,
    name: 'location',
  })
  location: string | null;

  @Column({
    type: 'enum',
    enum: TweetType,
    nullable: false,
    name: 'type',
  })
  type: TweetType;

  @Column({
    type: 'enum',
    enum: TweetCategory,
    nullable: true,
    default: null,
    name: 'category',
  })
  category: TweetCategory;

  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
    name: 'inherit_view_permissions',
  })
  inheritViewPermissions: boolean;

  @Column({
    type: 'boolean',
    nullable: true,
    default: false,
    name: 'inherit_edit_permissions',
  })
  inheritEditPermissions: boolean;

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

  // --------------------------------------------
  // Relations
  // --------------------------------------------

  @ManyToOne(() => TweetsSchema, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: TweetsSchema | null;

  @ManyToOne(() => UsersSchema, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: UsersSchema;

  @OneToMany(() => PermissionsSchema, (permission) => permission.tweet, {
    cascade: true,
  })
  permissions: PermissionsSchema[];

  @ManyToMany(() => HashtagsSchema, (hashtag) => hashtag.tweets, {
    cascade: true,
  })
  @JoinTable({
    name: 'tweets_hashtags',
    joinColumn: {
      name: 'tweet_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'hashtag_id',
      referencedColumnName: 'id',
    },
  })
  hashtags: HashtagsSchema[];
}
