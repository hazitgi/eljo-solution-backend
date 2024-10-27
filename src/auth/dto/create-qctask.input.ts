// DTO for CreateQCTaskInput
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateQCTaskInput {
  @Field(() => Int)
  work_orderId: number; // Reference to work order

  @Field()
  qc_type: string;

  @Field(() => Int)
  assigneeId: number; // Reference to user

  @Field()
  status: string;
}
