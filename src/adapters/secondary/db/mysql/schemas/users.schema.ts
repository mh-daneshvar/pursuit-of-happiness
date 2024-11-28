import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import TweetsSchema from '@SecondaryAdapters/db/mysql/schemas/tweets.schema';
import MembersSchema from '@SecondaryAdapters/db/mysql/schemas/members.schema';

@Entity('users')
export default class UsersSchema {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'first_name',
  })
  firstname: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
    name: 'last_name',
  })
  lastname: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
    name: 'username',
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 15, // Maximum length for international mobile numbers with country code
    nullable: true,
    unique: true,
    name: 'mobile_number',
  })
  mobileNumber: string | null;

  @Column({
    type: 'varchar',
    length: 320, // Maximum length of an email address as per RFC 3696/5321
    nullable: false,
    unique: true,
    name: 'email',
  })
  email: string;

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

  // --------------------------------------------
  // Relations
  // --------------------------------------------

  @OneToMany(() => TweetsSchema, (tweet) => tweet.author, {
    cascade: true,
  })
  tweets: TweetsSchema[];

  @OneToMany(() => MembersSchema, (member) => member.group, {
    cascade: false,
  })
  memberships: MembersSchema[];
}
