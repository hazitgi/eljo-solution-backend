import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AssignWorkOrderInput {
  @Field(() => Int)
  workOrderId: number;

  @Field(() => Int)
  userId: number;
}
