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
@Entity('files')
export class File {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => QCTask)
  @ManyToOne(() => QCTask, (qcTask) => qcTask.id)
  task: QCTask;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  file_name: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  file_path: string;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  file_type: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  size: number;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
