import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { isNullableType } from 'graphql';
// import { TripTicket } from 'src/trip-ticket/entities/trip-ticket.entity';

@InputType()
export class UpsertTripTicketstInput {
  @Field(() => Int)
  tripId: number;

  @Field(() => Int, {nullable: true})
  ticketId: number;

  @Field(() => Int, {nullable: true})
  personId: number;

  @Field(() => Int, {nullable: true})
  cargoId: number;

  @Field(() => Int, {nullable: true})
  dependentTripId: number;

  @Field(() => Int, {nullable: true})
  tripRequestId: number;

  @Field(() => Int, {nullable: true})
  statusId: number;   

  @Field(() => Int, { nullable: true })
  createdById: number;

  @Field(() => Int, { nullable: true })
  modifiedById: number;
}
