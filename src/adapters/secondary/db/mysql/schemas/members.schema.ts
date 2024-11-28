import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import GroupsSchema from './groups.schema';
import UsersSchema from '@SecondaryAdapters/db/mysql/schemas/users.schema';

@Entity('members')
export default class MembersSchema {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

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

  @ManyToOne(() => GroupsSchema, (group) => group.members, { nullable: false })
  @JoinColumn({ name: 'group_id' })
  group: GroupsSchema;

  @ManyToOne(() => UsersSchema, (user) => user.memberships, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UsersSchema;
}
