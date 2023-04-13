import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { isNullableType } from 'graphql';
import { CargoInput } from './cargo.input';
import { PersonInput } from './person.input';

// import { TripTicket } from 'src/trip-ticket/entities/trip-ticket.entity';

@InputType()
export class AddTripTicketInput {
  @Field(() => Int)
  tripId: number

  @Field(() => PersonInput, { nullable: true })
  person: PersonInput

  @Field(() => CargoInput, { nullable: true })
  cargo: CargoInput

  // @Field(() => Int, {nullable: true})
  // personId: number;

  // @Field(() => Int, {nullable: true})
  // cargoId: number;

  @Field(() => Int, {nullable: true})
  dependentTicketId: number;

  @Field(() => Int, {nullable: true})
  tripRequestId: number;

  // @Field(() => Int, {nullable: true})
  // statusId: number;   

  // @Field(() => Int, { nullable: true })
  // createdById: number;

  // @Field(() => Int, { nullable: true })
  // modifiedById: number;
}
