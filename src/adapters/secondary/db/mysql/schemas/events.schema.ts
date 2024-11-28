import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventAction } from '@Domain/sharedKernel/entities/types/eventAction.enum';
import { EventableType } from '@Domain/sharedKernel/entities/types/eventableType.enum';
import UsersSchema from './users.schema';

@Entity('events')
export default class EventsSchema {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'enum',
    enum: EventableType,
    nullable: false,
    name: 'eventable_type',
  })
  eventableType: EventableType;

  @Column({
    type: 'int',
    nullable: false,
    name: 'eventable_id',
  })
  eventableID: number;

  @ManyToOne(() => UsersSchema, { nullable: false })
  @JoinColumn({ name: 'actor_id' })
  actor: UsersSchema;

  @Column({
    type: 'enum',
    enum: EventAction,
    nullable: false,
    default: null,
    name: 'action',
  })
  action: EventAction;

  @Column({
    type: 'json',
    nullable: true,
    default: null,
    name: 'description',
  })
  description: unknown;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    precision: null,
    name: 'created_at',
  })
  createdAt: Date;
}
