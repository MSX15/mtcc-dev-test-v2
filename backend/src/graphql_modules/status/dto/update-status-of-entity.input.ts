import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateStatusOfEntityInput {
  @Field(() => Int)
  entityId: number;

  @Field(() => Int)
  entityStatusId: number;
}
