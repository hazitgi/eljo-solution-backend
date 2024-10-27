// DTO for CreateQCChecklistInput
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateQCChecklistInput {
  @Field(() => Int)
  taskId: number; // Reference to task

  @Field()
  category: string;

  @Field()
  parameter: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  comments?: string;
}
