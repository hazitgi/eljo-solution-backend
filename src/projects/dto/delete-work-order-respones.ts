import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteWorkOrdertResponse {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  message: string;
}
