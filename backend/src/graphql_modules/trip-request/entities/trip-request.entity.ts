import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Location } from 'src/graphql_modules/location/entities/location.entity';
import { Person } from 'src/graphql_modules/person/entities/person.entity';
// import { Cargo } from 'src/cargo/entities/cargo.entity';
import { Status } from 'src/graphql_modules/status/entities/status.entity';
@ObjectType()
export class TripRequest {
  @Field(() => Int)
  id: number;
  
  @Field(() => Int)
  fromLocationId: number;
 
  @Field()
  fromLocation: Location
  
  @Field(() => Int)
  toLocationId: number;
  
  @Field()
  toLocation: Location

  @Field({ nullable: true })
  departEarliest: Date
  
  @Field({ nullable: true })
  departLatest: Date
  
  @Field({ nullable: true })
  arriveEarliest: Date
  
  @Field({ nullable: true })
  arriveLatest: Date

  @Field(() => Int, { nullable: true })
  createdById: number;

  @Field()
  createdBy: Person

  @Field({ nullable: true })
  createdAt: Date

  @Field(() => Int, { nullable: true })
  modifiedById: number;

  @Field()
  modifiedBy: Person

  @Field({ nullable: true })
  modifiedAt: Date

  @Field({ nullable: true })
  remarks: string

  @Field(() => Int, { nullable: true })
  statusId: number;

  @Field(() => Status)
  status: Status;

  @Field(() => [Person], { nullable: true })
  personList: Person[];

  // @Field(() => [Cargo], { nullable: true })
  // cargoList: Cargo[];
}
