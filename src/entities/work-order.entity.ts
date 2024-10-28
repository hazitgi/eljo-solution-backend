import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from './project.entity';
import { WorkOrderMode } from 'src/projects/dto/create-work-order.dto';

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
    enum: WorkOrderMode,
    default: WorkOrderMode.FULL,
  })
  mode: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

    // Define the ManyToOne relationship with Project
    @Field(() => Project)
    @ManyToOne(() => Project, (project) => project.workOrders, { onDelete: 'CASCADE' })
    project: Project;
}
