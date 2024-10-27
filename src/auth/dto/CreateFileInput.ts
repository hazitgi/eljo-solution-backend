// DTO for CreateFileInput
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateFileInput {
  @Field(() => Int)
  taskId: number; // Reference to task

  @Field()
  file_name: string;

  @Field()
  file_path: string;

  @Field()
  file_type: string;

  @Field(() => Int)
  size: number;
}
