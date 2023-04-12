import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Location } from 'src/graphql_modules/location/entities/location.entity';
// import { Person } from 'src/person/entities/person.entity';
import { Status } from 'src/graphql_modules/status/entities/status.entity';
// import { TripRequest } from 'src/trip-request/entities/trip-request.entity';
// import { TripTicket } from 'src/trip-ticket/entities/trip-ticket.entity';

@ObjectType()
export class CargoTicket {
    @Field(() => Int)
    id: number

    @Field(() => Float, {nullable: true})
    weight: number  

    @Field({ nullable: true })
    remarks: string

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
}