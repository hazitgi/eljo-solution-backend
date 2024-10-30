import { InputType, Field, Int, registerEnumType } from '@nestjs/graphql';

export enum WorkOrderMode {
  FULL = 'full',
  PARTIAL = 'partial',
}

registerEnumType(WorkOrderMode, {
  name: 'WorkOrderMode',
});

@InputType()
export class CreateWorkOrderDto {
  work_order_number: string;

  @Field(() => Int)
  projectId: number;

  @Field()
  sign_type: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => WorkOrderMode)
  mode: WorkOrderMode;

  @Field(() => [CreateQCTaskWithChecklistInput], { nullable: true })
  qcChecklist: CreateQCTaskWithChecklistInput[];

  @Field(() => Number, { nullable: true })
  assigneeId: number; // ID of the user assigned to the task
}

@InputType()
export class CreateQCTaskWithChecklistInput {
  // @Field(() => Number)
  // workOrderId: number; // ID of the associated work order

  @Field()
  qc_type: string; // Type of QC task

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
