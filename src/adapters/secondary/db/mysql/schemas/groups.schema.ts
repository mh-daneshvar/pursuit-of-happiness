import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import UsersSchema from './users.schema';
import MembersSchema from './members.schema';
import PermissionsSchema from '@SecondaryAdapters/db/mysql/schemas/permissions.schema';

@Entity('groups')
export default class GroupsSchema {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    name: 'name',
  })
  name: string;

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

  @ManyToOne(() => GroupsSchema, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: GroupsSchema | null;

  @ManyToOne(() => UsersSchema, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner: UsersSchema;

  @OneToMany(() => MembersSchema, (member) => member.group, {
    cascade: true,
  })
  members: MembersSchema[];

  @OneToMany(() => PermissionsSchema, (permission) => permission.group, {
    cascade: true,
  })
  permissions: PermissionsSchema[];
}
