import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class PersonInput {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field({ nullable: true })
  name: string;
}
