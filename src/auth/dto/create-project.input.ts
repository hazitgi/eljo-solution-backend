// DTO for CreateProjectInput
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateProjectInput {
  @Field()
  project_number: string;

  @Field()
  project_name: string;

  @Field()
  status: string;
}
