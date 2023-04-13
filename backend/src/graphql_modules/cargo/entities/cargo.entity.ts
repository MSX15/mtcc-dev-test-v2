import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Cargo {
  @Field(() => Int)
  id: number;
  
  @Field({ nullable: true })
  description: string;

  @Field(() => Float)
  cargoWeight: number;

}
