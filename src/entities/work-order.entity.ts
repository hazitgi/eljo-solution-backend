import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Project } from './project.entity';

@ObjectType()
@Entity('work_orders')
export class WorkOrder {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  work_order_number: string;

  @Field(() => Project)
  @ManyToOne(() => Project, (project) => project.id)
  project: Project;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  sign_type: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  quantity: number;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
