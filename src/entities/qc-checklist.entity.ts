import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { File } from './file.entity';
import { WorkOrder } from './work-order.entity';

@ObjectType()
@Entity('qc_checklists')
export class QCChecklist {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => WorkOrder)
  @ManyToOne(() => WorkOrder, (workOrder) => workOrder.qcChecklist, {
    onDelete: 'CASCADE',
  })
  workOrder: WorkOrder;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  parameter: string;

  @Field({ nullable: true })
  @Column({ type: 'enum', enum: ['Yes', 'No'] })
  status: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  comments: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Field(() => [File], { nullable: true })
  @OneToMany(() => File, (file) => file.checklist, { onDelete: 'CASCADE' })
  files: File[];
}
