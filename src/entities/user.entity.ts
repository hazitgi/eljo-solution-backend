import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@ObjectType() // This decorator makes the class a GraphQL object type
@Entity('users')
export class User {
  @Field() // This decorator exposes the field to GraphQL
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Field({})
  @Column({ type: 'enum', enum: ['admin', 'qc_inspector'] })
  role: 'admin' | 'qc_inspector';

  @Field()
  @CreateDateColumn()
  created_at: Date;
}
