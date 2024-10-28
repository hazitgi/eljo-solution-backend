import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateQCTaskInput {
  @Field()
  work_order_id: number;

  @Field()
  qc_type: string;

  @Field()
  assignee_id: number;

  @Field({ nullable: true })
  scheduled_date?: Date;
}