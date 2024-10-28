// DTO for CreateQCChecklistInput
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateQCChecklistInput {
  @Field(() => Int)
  taskId: number; // Reference to task

  @Field()
  category: string;

  @Field()
  parameter: string;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  comments?: string;
}
