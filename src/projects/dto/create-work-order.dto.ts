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
}
