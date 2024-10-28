import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateWorkOrderDto {
  @Field()
  work_order_number: string;

  @Field(() => Int)
  projectId: number;

  @Field()
  sign_type: string;

  @Field(() => Int)
  quantity: number;

  @Field()
  status: string;
}