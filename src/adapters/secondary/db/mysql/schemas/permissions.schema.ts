import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import TweetsSchema from './tweets.schema';
import MembersSchema from './members.schema';
import { PermissionType } from '@Domain/sharedKernel/entities/types/permissionType.enum';
import { PermittedType } from '@Domain/sharedKernel/entities/types/permittedType.enum';
import GroupsSchema from '@SecondaryAdapters/db/mysql/schemas/groups.schema';
import UsersSchema from '@SecondaryAdapters/db/mysql/schemas/users.schema';

@Entity('permissions')
@Unique(['type', 'permittedType', 'group', 'user', 'member', 'tweet'])
export default class PermissionsSchema {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'enum',
    enum: PermissionType,
    nullable: false,
    name: 'permission_type',
  })
  type: PermissionType;

  @Column({
    type: 'enum',
    enum: PermittedType,
    nullable: false,
    name: 'permitted_type',
  })
  permittedType: PermittedType;

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

  @ManyToOne(() => TweetsSchema, { nullable: false })
  @JoinColumn({ name: 'tweet_id' })
  tweet: TweetsSchema;

  @ManyToOne(() => GroupsSchema, { nullable: true })
  @JoinColumn({ name: 'group_id' })
  group: GroupsSchema;

  @ManyToOne(() => UsersSchema, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: UsersSchema;

  @ManyToOne(() => MembersSchema, { nullable: true })
  @JoinColumn({ name: 'member_id' })
  member: MembersSchema;
}
