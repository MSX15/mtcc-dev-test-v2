import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TripRequestService } from './trip-request.service';
import { TripRequest } from './entities/trip-request.entity';
import { CreateTripRequestInput } from './dto/create-trip-request.input';
import { UpdateTripRequestInput } from './dto/update-trip-request.input';
// import { UpdateStatusOfEntityInput } from 'src/status/dto/update-status-of-entity.input';

@Resolver(() => TripRequest)
export class TripRequestResolver {
  constructor(private readonly tripRequestService: TripRequestService) {}

  @Mutation(() => TripRequest)
  createTripRequest(@Args('createTripRequestInput') createTripRequestInput: CreateTripRequestInput) {
    return this.tripRequestService.create(createTripRequestInput);
  }

  @Query(() => [TripRequest], { name: 'tripRequests' })
  findAll() {
    return this.tripRequestService.findAll();
  }

  @Query(() => TripRequest, { name: 'tripRequest' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tripRequestService.findOne(id);
  }

  // @Mutation(() => TripRequest)
  // updateTripRequest(@Args('updateTripRequestInput') updateTripRequestInput: UpdateTripRequestInput) {
  //   return this.tripRequestService.update(updateTripRequestInput.id, updateTripRequestInput);
  // }

  // @Mutation(() => TripRequest)
  // updateTripRequestStatus(@Args('updateStatusOfEntityInput') updateStatusOfEntityInput: UpdateStatusOfEntityInput) {
  //   return this.tripRequestService.updateStatus(updateStatusOfEntityInput.entityId, updateStatusOfEntityInput.entityStatusId);
  // }
}
