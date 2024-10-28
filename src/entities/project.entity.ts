import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ProjectStatus } from 'src/projects/dto/create-project.dto';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { QCTask } from './qc-task.entity';

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
  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  client_name: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  country: string;

  @Field(() => ProjectStatus)
  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PENDING,
  })
  status: ProjectStatus;

  @Field()
  @CreateDateColumn()
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

}
