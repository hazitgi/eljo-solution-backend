import { CreateQCTaskInput } from './create-qc.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateQcInput extends PartialType(CreateQCTaskInput) {
  @Field(() => Int)
  id: number;
}
