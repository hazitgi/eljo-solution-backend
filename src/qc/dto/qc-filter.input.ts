import { InputType, Field, Int } from '@nestjs/graphql';
import { QCStatus } from '../../entities/qc-task.entity';

@InputType()
export class QCTaskFilterInput {
  @Field(() => Int, { nullable: true })
  workOrderId?: number;

  @Field(() => Int, { nullable: true })
  assigneeId?: number;

  @Field(() => QCStatus, { nullable: true })
  status?: QCStatus;

  @Field({ nullable: true })
  qc_type?: string;

  @Field(() => Date, { nullable: true })
  dateFrom?: Date;

  @Field(() => Date, { nullable: true })
  dateTo?: Date;
}
