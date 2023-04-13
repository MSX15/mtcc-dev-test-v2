import { InputType, Int, Field } from '@nestjs/graphql';
import { TripRequestPersonInput } from './trip-request-person.input';
import { TripRequestCargoInput } from './trip-request-cargo.input';

@InputType()
export class CreateTripRequestInput {
  @Field(() => Int)
  fromLocationId: number;

  @Field(() => Int)
  toLocationId: number;

  @Field({ nullable: true })
  departEarliest: Date
  
  @Field({ nullable: true })
  departLatest: Date
  
  @Field({ nullable: true })
  arriveEarliest: Date
  
  @Field({ nullable: true })
  arriveLatest: Date

  @Field({ nullable: true })
  remarks: string
  
  @Field(() => Int, { nullable: true })
  createdById: number;

  @Field(() => Int, { nullable: true })
  modifiedById: number;
  
  @Field(() => [TripRequestPersonInput], { nullable: true, defaultValue: [] })
  personList: [TripRequestPersonInput]
  
  @Field(() => [TripRequestCargoInput], { nullable: true, defaultValue: [] })
  cargoList: [TripRequestCargoInput]
}
