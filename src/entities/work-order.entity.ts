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
import { Project } from './project.entity';
import { WorkOrderMode } from 'src/projects/dto/create-work-order.dto';
import { QCChecklist } from './qc-checklist.entity';

import { User } from './user.entity';

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
@Entity('work_orders')
export class WorkOrder {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  work_order_number: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  projectId: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  sign_type: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  quantity: number;

  @Field()
  @Column({
    type: 'enum',
    enum: ['full', 'partial'],
    default: 'full',
  })
  mode: string;

  @Field()
  @Column({ type: 'enum', enum: QCStatus, default: QCStatus.PENDING })
  status: QCStatus;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  assignee: User;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Field(() => Project, { nullable: true })
  @ManyToOne(() => Project, (project) => project.workOrders, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Field(() => [QCChecklist])
  @OneToMany(() => QCChecklist, (qcChecklist) => qcChecklist.workOrder)
  qcChecklist: QCChecklist[];
}
