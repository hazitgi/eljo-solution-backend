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
import { QCTask } from './qc-task.entity';
import { File } from './file.entity';

@ObjectType()
@Entity('qc_checklists')
export class QCChecklist {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => QCTask)
  @ManyToOne(() => QCTask, (qcTask) => qcTask.id, { onDelete: 'CASCADE' })
  task: QCTask;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  parameter: string;

  @Field({ nullable: true })
  @Column({ type: 'enum', enum: ["Yes", "No"] })
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

  // Define a one-to-many relationship with File
  @Field(() => [File], { nullable: true })
  @OneToMany(() => File, (file) => file.checklist)
  files: File[];
}
