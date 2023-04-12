import { ObjectType, Field, Int, InputType } from '@nestjs/graphql';

@InputType()
export class TripFilter {
    // @Field(() => Date, {nullable: true })
    // startDate: Date

    // @Field(() => Date, { nullable: true })
    // endDate: Date

    @Field(() => Date, {nullable: true })
    earliestDeparture: Date

    @Field(() => Date, { nullable: true })
    latestDeparture: Date
    
    @Field(() => Date, {nullable: true })
    earliestArrival: Date

    @Field(() => Date, { nullable: true })
    latestArrival: Date

    @Field(() => Int, { nullable: true })
    statusId: number
}