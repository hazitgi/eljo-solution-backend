// import { InputType, Field, Int } from '@nestjs/graphql';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { QCStatus } from 'src/entities/qc-task.entity';


@InputType()
export class UpdateQCChecklistInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  parameter?: string;

  @Field({ nullable: true })
  status?: QCStatus;

  @Field({ nullable: true })
  comments?: string;
}


@InputType()
export class QCChecklistFilterInput {
  @Field(() => Int, { nullable: true })
  taskId?: number;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  status?: string;
}