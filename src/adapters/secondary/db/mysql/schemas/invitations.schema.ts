import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import GroupsSchema from './groups.schema';
import UsersSchema from './users.schema';
import { InvitationStatus } from '@Domain/sharedKernel/entities/types/invitationStatus.enum';

@Entity('invitations')
export default class InvitationsSchema {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
    name: 'link',
  })
  link: string;

  @ManyToOne(() => UsersSchema, { nullable: false })
  @JoinColumn({ name: 'inviter_id' })
  inviter: UsersSchema;

  @ManyToOne(() => UsersSchema, { nullable: false })
  @JoinColumn({ name: 'invitee_id' })
  invitee: UsersSchema;

  @ManyToOne(() => GroupsSchema, { nullable: false })
  @JoinColumn({ name: 'group_id' })
  relatedGroup: GroupsSchema;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    nullable: false,
    default: InvitationStatus.SENT,
    name: 'status',
  })
  status: InvitationStatus;

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
