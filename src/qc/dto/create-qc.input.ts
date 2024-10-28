import { InputType, Field } from '@nestjs/graphql';
import { QCStatus } from 'src/entities/qc-task.entity';

@InputType()
export class CreateQCTaskInput {
  @Field(() => Number)
  workOrderId: number; // ID of the associated work order

  @Field()
  qc_type: string; // Type of QC task

  @Field(() => Number)
  assigneeId: number; // ID of the user assigned to the task

  @Field(() => Date, { nullable: true })
  scheduled_date?: Date; // Optional scheduled date for the task
}
