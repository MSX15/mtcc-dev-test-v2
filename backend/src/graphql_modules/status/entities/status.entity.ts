import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Status {
  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field({nullable: true})
  belongsToEntityType: string

  @Field()
  isActive: boolean
}
