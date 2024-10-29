import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { WorkOrder } from './work-order.entity';
import { User } from './user.entity';
import { QCChecklist } from './qc-checklist.entity';

export enum QCStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  STARTED = 'started',
  FINISHED = 'finished',
}

registerEnumType(QCStatus, {
  name: 'QCStatus', // This name is used in the GraphQL schema
});

@ObjectType()
@Entity('qc_tasks')
export class QCTask {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => WorkOrder)
  @ManyToOne(() => WorkOrder, (workOrder) => workOrder.id, {
    onDelete: 'CASCADE',
  })
  work_order: WorkOrder;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  qc_type: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  assignee: User;

  @Field()
  @Column({ type: 'enum', enum: QCStatus, default: QCStatus.PENDING })
  status: QCStatus;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  // Define the OneToMany relationship with WorkOrder
  @Field(() => [QCChecklist])
  @OneToMany(() => QCChecklist, (qcChecklist) => qcChecklist.task)
  qcChecklist: QCChecklist[];
}
