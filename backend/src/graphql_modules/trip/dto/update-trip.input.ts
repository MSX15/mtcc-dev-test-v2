import { CreateTripInput } from './create-trip.input';
import { InputType, Field, Int, PartialType, Float } from '@nestjs/graphql';
import { isNullableType } from 'graphql';
// import { TripTicket } from 'src/trip-ticket/entities/trip-ticket.entity';

@InputType()
export class UpdateTripInput extends PartialType(CreateTripInput) {
  @Field(() => Int)
  id: number;

  @Field(() => Int, {nullable: true})
  fromLocationId: number

  @Field(() => Int, {nullable: true})
  toLocationId: number  

  @Field({nullable: true})
  departureTime: Date    

  @Field({nullable: true})
  arrivalTime: Date     

  @Field(() => Int, {nullable: true})
  peopleCapacity:  number
  @Field(() => Int, {nullable: true})
  peopleCapacityRemaining: number

  @Field(() => Float, {nullable: true})
  cargoWeightCapacity: number
  @Field(() => Float, {nullable: true})
  cargoWeightCapacityRemaining: number


  // NOT REALLY EXPOSED, JUST FOR DEMO SINCE THERE IS NO USER CONTEXT IN THIS DEMO
  @Field(() => Int, { nullable: true })
  createdById: number;

  @Field(() => Int, { nullable: true })
  modifiedById: number;
}
