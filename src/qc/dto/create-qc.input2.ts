import { InputType, Field } from '@nestjs/graphql';
import { QCStatus } from 'src/entities/qc-task.entity';

@InputType()
export class CreateQCTaskWithChecklistInput {
  @Field(() => Number)
  workOrderId: number; // ID of the associated work order

  @Field()
  qc_type: string; // Type of QC task

  @Field(() => Number, { nullable: true })
  assigneeId: number; // ID of the user assigned to the task

  @Field(() => [ChecklistItemInput])
  checklistItems: ChecklistItemInput[];
}

@InputType()
export class ChecklistItemInput {
  @Field()
  category: string;

  @Field()
  parameter: string;

  @Field({ nullable: true })
  status?: 'Yes' | 'No';

  @Field({ nullable: true })
  comments?: string;
}
