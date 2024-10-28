import { InputType, Field, ID } from '@nestjs/graphql';
import { ProjectStatus } from './create-project.dto';

@InputType()
export class UpdateProjectInput {
  project_number: string;

  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  project_name?: string;

  @Field(() => ProjectStatus, { nullable: true })
  status: ProjectStatus;

  @Field({ nullable: true })
  client_name: string;

  @Field({ nullable: true })
  country: string;

  @Field({ nullable: true })
  location: string;
}
