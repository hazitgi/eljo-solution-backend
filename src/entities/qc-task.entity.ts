import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { WorkOrder } from './work-order.entity';
import { User } from './user.entity';

@ObjectType()
@Entity('qc_tasks')
export class QCTask {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => WorkOrder)
  @ManyToOne(() => WorkOrder, (workOrder) => workOrder.id)
  work_order: WorkOrder;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  qc_type: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id)
  assignee: User;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
