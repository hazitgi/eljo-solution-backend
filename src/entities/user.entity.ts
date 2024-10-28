import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  resetToken: string | null;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry: Date | null;

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: ['admin', 'qc_inspector'],
    default: 'qc_inspector',
  })
  role: 'admin' | 'qc_inspector';

  @Field(() => Date)
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
