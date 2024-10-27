import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity('projects')
export class Project {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  project_number: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  project_name: string;

  @Field()
  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
