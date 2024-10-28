import {
  InputType,
  Field,
  EnumOptions,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

export enum ProjectStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
}

registerEnumType(ProjectStatus, {
  name: 'ProjectStatus', // This name is used in the GraphQL schema
});

@InputType()
export class CreateProjectInput {
  project_number: string;

  @Field()
  project_name: string;

  @Field()
  client_name: string;

  @Field()
  country: string;

  @Field()
  location: string;

  @Field(() => ProjectStatus)
  status: ProjectStatus;
}
