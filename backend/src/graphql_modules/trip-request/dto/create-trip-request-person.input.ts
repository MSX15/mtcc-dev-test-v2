import { InputType, Int, Field } from '@nestjs/graphql';
import { Person } from 'src/graphql_modules/person/entities/person.entity';

@InputType()
export class CreateTripRequestPersonInput {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field({ nullable: true })
  name: string;
}
