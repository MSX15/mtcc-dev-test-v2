import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Location } from 'src/graphql_modules/location/entities/location.entity';
// import { Person } from 'src/person/entities/person.entity';
import { Status } from 'src/graphql_modules/status/entities/status.entity';
// import { TripRequest } from 'src/trip-request/entities/trip-request.entity';
// import { TripTicket } from 'src/trip-ticket/entities/trip-ticket.entity';

@ObjectType()
export class Trip {
  @Field(() => Int)
  id: number

  @Field(() => Int)
  fromLocationId: number

  @Field(() => Int)
  toLocationId: number  

  @Field()
  departureTime: Date    

  @Field()
  arrivalTime: Date     

  @Field(() => Int)
  peopleCapacity :number

  @Field(() => Int)
  peopleCapacityRemaining    :number
  
  @Field(() => Int)
  cargoWeightCapacityRemaining    :number

  // @Field(() => Int)
  // cargoVolumeCapacity  :number

  @Field(() => Int)
  cargoWeightCapacity  :number

  @Field(() => Int, { nullable: true })
  tripRequestId  :number
  
  // @Field(() => Int)
  // cargoVolume    :number

  @Field(() => Int, {nullable: true})
  statusId: number 

  @Field(() => Int, {nullable: true})
  createdById: number  

  @Field({nullable: true})
  createdAt: Date

  @Field(() => Int, {nullable: true})
  modifiedById: number

  @Field({nullable: true})
  modifiedAt: Date    

  @Field()
  status: Status         
  // @Field(() => Person)
  // createdBy: Person    

  @Field(() => Location)
  fromLocation: Location 
  
  @Field(() => Location)
  toLocation: Location  

  // @Field(() => Person)
  // modifiedBy: Person  

  // @Field(() => TripRequest, { nullable: true})
  // tripRequest: TripRequest  

  // @Field(() => [TripTicket], { nullable: true })
  // tripTickets: TripTicket[];
}
