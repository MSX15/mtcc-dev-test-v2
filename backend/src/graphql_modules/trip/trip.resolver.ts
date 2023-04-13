
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TripService } from './trip.service';
import { Trip } from './entities/trip.entity';
import { CreateTripInput } from './dto/create-trip.input';
import { UpdateTripInput } from './dto/update-trip.input';
import { TripFilter } from './dto/trip.filter';
import { AddTripTicketInput } from './dto/add-trip-ticket.input';
import { TripTicket } from '../tripTicket/entities/trip-ticket.entity';
import { UpdateStatusOfEntityInput } from '../status/dto/update-status-of-entity.input';
// import { UpdateStatusOfEntityInput } from 'src/status/dto/update-status-of-entity.input';
// import { UpsertTripTicketstInput } from './dto/upsert-trip-tickets.input';

@Resolver(() => Trip)
export class TripResolver {
  constructor(private readonly tripService: TripService) {}

  @Mutation(() => Trip)
  createTrip(@Args('createTripInput') createTripInput: CreateTripInput) {
    return this.tripService.create(createTripInput);
  }

  @Query(() => [Trip], { name: 'trips' })
  findAll(@Args('tripFilter', { nullable: true }) tripFilter: TripFilter) {
    return this.tripService.findAll(tripFilter);
    // return this.tripService.findAll(null);
  }

  // @Query(() => [Trip], { name: 'tripsFiltered' })
  // findAllFiltered(@Args('filter') tripFilter: TripFilter) {
  //   return this.tripService.findAll(tripFilter);
  // }

  @Query(() => Trip, { name: 'trip' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tripService.findOne(id);
  }

  @Mutation(() => Trip)
  updateTrip(@Args('updateTripInput') updateTripInput: UpdateTripInput) {
    return this.tripService.update(updateTripInput.id, updateTripInput);
  }

  @Mutation(() => Trip)
  removeTrip(@Args('id', { type: () => Int }) id: number) {
    return this.tripService.remove(id);
  }

  @Mutation(() => Trip)
  addTripTicket(@Args('addTripTicketInput') addTripTicketInput: AddTripTicketInput) {
    return this.tripService.addTripTicket(addTripTicketInput);
  }

  @Mutation(() => TripTicket)
  cancelTripTicket(@Args('tripTicketId', { type: () => Int}) tripTicketId: number) {
    return this.tripService.cancelTicketTrip(tripTicketId);
  }

  @Mutation(() => Trip)
  updateTripStatus(@Args('updateStatusOfEntityInput') updateStatusOfEntityInput: UpdateStatusOfEntityInput) {
    return this.tripService.updateStatus(updateStatusOfEntityInput.entityId, updateStatusOfEntityInput.entityStatusId);
  }

  // @Mutation(() => Trip)
  // addTicketToTrip(@Args('upsertTripTicketstInput') upsertTripTicketstInput: UpsertTripTicketstInput) {
  //   return this.tripService.upsertTripTickets(upsertTripTicketstInput.tripId, upsertTripTicketstInput);
  // }
}
