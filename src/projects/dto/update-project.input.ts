import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class UpdateProjectInput {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  project_name?: string;

  @Field({ nullable: true })
  status?: string;
}
