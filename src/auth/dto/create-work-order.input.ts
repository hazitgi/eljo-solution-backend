
// DTO for CreateWorkOrderInput
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateWorkOrderInput {
  @Field()
  work_order_number: string;

  @Field(() => Int)
  projectId: number; // Reference to project

  @Field()
  sign_type: string;

  @Field(() => Int)
  quantity: number;

  @Field()
  status: string;
}
