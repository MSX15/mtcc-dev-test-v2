import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class TripRequestPersonInput {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field({ nullable: true })
  name: string;
}
