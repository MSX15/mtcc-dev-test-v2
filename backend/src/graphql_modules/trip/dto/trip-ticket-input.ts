import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { PersonInput } from './person.input';
import { CargoInput } from './cargo.input';

@InputType()
export class TripTicketInput {
  // @Field(() => Int, { nullable: true })
  // id: number;

  @Field(() => CargoInput, { nullable: true })
  cargo: CargoInput;

  @Field(() => PersonInput, { nullable: true })
  person: PersonInput;
  
  @Field({ nullable: true })
  remarks: string;
}
