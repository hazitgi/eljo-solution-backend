import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { QCTask } from './qc-task.entity';

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
  category: string; // e.g., "Letter Moulding", "Metal Fabrication", "CNC Laser Cutting", "Sanding"

  @Field()
  @Column({ type: 'varchar', length: 255 })
  parameter: string; // e.g., "Depth of Material", "Surface Finish", etc.

  @Field({nullable: true })
  @Column({ type: 'enum', enum:["Yes", "No"] })
  status: string;  // "Yes" or "No"

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  comments: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
