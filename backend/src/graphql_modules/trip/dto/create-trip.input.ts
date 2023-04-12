import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateTripInput {

  @Field(() => Int, { nullable: true })
  tripRequestId  :number
  
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
  
  @Field(() => Float)
  cargoWeightCapacity  :number
  
  @Field(() => Int, { nullable: true })
  peopleCapacityRemaining    :number
  
  @Field(() => Float, { nullable: true })
  cargoWeightCapacityRemaining    :number
  
  // @Field(() => Int, { nullable: true })
  // cargoVolumeCapacity  :number

  // @Field(() => Int, { nullable: true })
  // cargoVolume    :number

}
