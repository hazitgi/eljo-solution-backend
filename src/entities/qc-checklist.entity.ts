import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { QCTask } from './qc-task.entity';

@ObjectType()
@Entity('qc_checklists')
export class QCChecklist {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => QCTask)
  @ManyToOne(() => QCTask, (qcTask) => qcTask.id)
  task: QCTask;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  parameter: string;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  comments: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
