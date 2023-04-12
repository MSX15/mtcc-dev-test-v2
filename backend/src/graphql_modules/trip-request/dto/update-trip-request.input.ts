import { Timestamp } from 'rxjs';
import { CreateTripRequestInput } from './create-trip-request.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
// import { Cargo } from 'src/cargo/entities/cargo.entity';

@InputType()
export class UpdateTripRequestInput extends PartialType(CreateTripRequestInput) {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  fromLocationId: number;

  @Field(() => Int, { nullable: true })
  toLocationId: number;

  // @Field({ nullable: true })
  // departEarliest: Date
  
  // @Field({ nullable: true })
  // departLatest: Date
  
  // @Field({ nullable: true })
  // arriveEarliest: Date
  
  // @Field({ nullable: true })
  // arriveLatest: Date

  @Field(() => Int, { nullable: true })
  createdById: number;

  @Field(() => Int, { nullable: true })
  modifiedById: number;
  
  // @Field({ nullable: true })
  // remarks: string
  
  // @Field(() => Int, { nullable: true })
  // statusId: number;

  @Field(() => [Int], { nullable: true })
  cargoListIds: number[];
}
