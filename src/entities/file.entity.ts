import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { QCChecklist } from './qc-checklist.entity';

@ObjectType()
@Entity('files')
export class File {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  filename: string;

  @Field()
  @Column({ nullable: true })
  originalname: string;

  @Field({ nullable: true })
  @Column()
  mimetype: string;

  @Field({ nullable: true })
  @Column()
  size: number;

  @Field({ nullable: true })
  @Column()
  path: string;

  @Field(() => QCChecklist)
  @ManyToOne(() => QCChecklist, (checklist) => checklist.files, {
    onDelete: 'CASCADE',
  })
  checklist: QCChecklist;

  @Field({ nullable: true })
  @CreateDateColumn()
  created_at: Date;
}
