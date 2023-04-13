import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class TripRequestCargoInput {
  @Field(() => Int, { nullable: true })
  id: number;
  
  @Field({ nullable: true })
  description: string;

  @Field(() => Float, { nullable: true })
  cargoWeight: number;
}
