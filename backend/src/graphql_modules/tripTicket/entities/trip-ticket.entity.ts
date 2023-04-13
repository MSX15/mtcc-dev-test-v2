import { ObjectType, Field, Int } from '@nestjs/graphql';
// import { Location } from 'src/location/entities/location.entity';
// import { Person } from 'src/person/entities/person.entity';
import { Cargo } from 'src/graphql_modules/cargo/entities/cargo.entity';
// import { Cargo } from 'src/cargo/entities/cargo.entity';
// import { Status } from 'src/status/entities/status.entity';
import { Status } from 'src/graphql_modules/status/entities/status.entity';
// import { Trip } from 'src/trip/entities/trip.entity';
// import { TripRequest } from 'src/trip-request/entities/trip-request.entity';

@ObjectType()
export class TripTicket {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  tripId: number;

//   @Field(() => Trip)
//   trip: Trip;

  @Field(() => Int, {nullable: true})
  personId: number;

//   @Field(() => Person, {nullable: true})
//   person: Person 

  @Field(() => Int, {nullable: true})
  cargoId: number;

  @Field(() => Cargo, { nullable: true})
  cargo: Cargo 

  // @Field(() => Int, {nullable: true})
  // dependentTripId: number;

  // @Field(() => TripTicket)
  // dependentTicket: Status    

  @Field(() => Int, {nullable: true})
  tripRequestId: number;

//   @Field(() => TripRequest)
//   tripRequest: TripRequest  

  @Field(() => Int, {nullable: true})
  statusId: number;

  @Field(() => Status, {nullable: true})
  status: Status    

  @Field(() => Int, { nullable: true })
  createdById: number;

//   @Field(() => Person, {nullable: true})
//   createdBy: Person 

  @Field({ nullable: true })
  createdAt: Date
  
  @Field(() => Int, { nullable: true })
  modifiedById: number;

//   @Field(() => Person, { nullable: true})
//   modifiedBy: Person 

  @Field({ nullable: true })
  modifiedAt: Date
}
