import { Injectable } from '@nestjs/common';
import { CreateTripInput } from './dto/create-trip.input';
import { UpdateTripInput } from './dto/update-trip.input';
import { UpsertTripTicketstInput } from './dto/upsert-trip-tickets.input';
import { PrismaService } from 'src/services/prisma.service';
import { TripFilter } from './dto/trip.filter';
import { ValidationError } from 'apollo-server-express';
// import { TripFilter } from './entities/trip.filter';
import * as dayjs from 'dayjs'
import { AddTripTicketInput } from './dto/add-trip-ticket.input';

@Injectable()
export class TripService {
  constructor(private prisma: PrismaService) {}

  readonly includes = { 
    fromLocation: true,
    toLocation: true,
    // createdBy: true,
    // modifiedBy: true,
    // tripRequest: {
    //   include: {
    //     createdBy: true,
    //     modifiedBy: true
    //   }
    // },
    // tripTickets: {
    //   include: {
    //     person: true,
    //     cargo: {
    //       include: {
    //         cargoDimensionCategory: true
    //       }
    //     }
    //   }
    // },
    status: true
  }


  async create(createTripInput: CreateTripInput) {
    let input = { ...createTripInput }

    let { 
      peopleCapacityRemaining,
      cargoWeightCapacityRemaining,
      ...restOfInput 
    } = createTripInput;
    peopleCapacityRemaining ??= restOfInput.peopleCapacity;
    cargoWeightCapacityRemaining ??= restOfInput.cargoWeightCapacity;

    if(cargoWeightCapacityRemaining > restOfInput.cargoWeightCapacity )
    {
      throw new ValidationError(`Cargo Capacity Remaining [ ${cargoWeightCapacityRemaining} ] cannot exceed Cargo Capacity [ ${restOfInput.cargoWeightCapacity} ]`)
    }

    if(peopleCapacityRemaining > restOfInput.peopleCapacity )
    {
      throw new ValidationError(`People Capacity Remaining [ ${peopleCapacityRemaining} ] cannot exceed People Capacity [ ${restOfInput.peopleCapacity} ]`)
    }


    return await this.prisma.trip.create({
        data: {
        ...restOfInput,
        peopleCapacityRemaining,
        cargoWeightCapacityRemaining,
        statusId: 1,
        createdById: 1,
        modifiedById: 1,
      }
    })
  }


  async findAll(tripFilter: TripFilter = null) {
    let filter:  any = {};
    if(tripFilter !== null)
    {
      filter = {
        AND: [
          {
            departureTime: (() => { 
              let filter: any = {};
              tripFilter.earliestDeparture && (filter.gte = tripFilter.earliestDeparture);
              tripFilter.latestDeparture && (filter.lte = tripFilter.latestDeparture);
              return filter;
            })()
          },
          {
            arrivalTime: (() => { 
              let filter: any = {};
              tripFilter.earliestArrival && (filter.gte = tripFilter.earliestArrival);
              tripFilter.latestArrival && (filter.lte = tripFilter.latestArrival);
              return filter;
            })()
          },
          {
            statusId: tripFilter.statusId ? { equals: tripFilter.statusId } : {}
          }
        ]
      }
    }

    return await this.prisma.trip.findMany({
      where: filter,
      include: { 
        ...this.includes
      }
    });
  }

  async findOne(id: number) {
    const result = await this.prisma.trip.findUnique({ 
      where: { id },
      include: { 
        ...this.includes
      }
    })

    // VALIDATION
    if(result === null)
    {
      throw new ValidationError(`Trip with Id [ ${id} ] does not exist`)
    }

    return result;
  }




  async update(id: number, updateTripInput: UpdateTripInput) {
    const {id: entityId, ...entityDataUpdated} = updateTripInput;
    const originalEntityData = await this.prisma.trip.findUnique({ 
      where: { id } ,
      include: { 
        status: true
      }
    });

    // VALIDATIONS
    if((await originalEntityData).statusId !== 1)
    {
      throw new ValidationError(`Only [ Pending ] trips may be updated. Current trip status is [ ${originalEntityData.status.name} ]`)
    }

    if(entityDataUpdated.cargoWeightCapacityRemaining > entityDataUpdated.cargoWeightCapacity )
    {
      throw new ValidationError(`Cargo Capacity Remaining [ ${entityDataUpdated.cargoWeightCapacityRemaining} ] cannot exceed Cargo Capacity [ ${entityDataUpdated.cargoWeightCapacity} ]`)
    }

    if(entityDataUpdated.peopleCapacityRemaining > entityDataUpdated.peopleCapacity )
    {
      throw new ValidationError(`People Capacity Remaining [ ${entityDataUpdated.peopleCapacityRemaining} ] cannot exceed People Capacity [ ${entityDataUpdated.peopleCapacity} ]`)
    }

    const randModifiedById = (Math.floor(Math.random() * 6) + 2)


    // const entity = await this.prisma.trip.findUnique({ where: { id } })
    await this.prisma.trip.update({
      where: { id },
      data: { 
        // ...entity,
        ...entityDataUpdated,
        modifiedById: randModifiedById,
        modifiedAt: dayjs().toDate()
      }
    })
    return await this.prisma.trip.findUnique({ 
      where: { id } ,
      include: { 
        ...this.includes
      }
    });
  }

  async remove(id: number)
  {
    const originalEntityData = await this.prisma.trip.findUnique({ 
      where: { id } ,
      include: { 
        status: true
      }
    });

    // VALIDATIONS
    if((await originalEntityData).statusId !== 1)
    {
      throw new ValidationError(`Only [ Pending ] trips may be removed. Current trip status is [ ${originalEntityData.status.name} ]`)
    } 

    await this.prisma.trip.delete({
      where: { id }
    })

    return originalEntityData;
  }


  async updateStatus(id: number, entityStatusId: number) {
    // const entity = await this.prisma.trip.findUnique({ where: { id } })
    const randModifiedById = (Math.floor(Math.random() * 6) + 2)
    await this.prisma.trip.update({
      where: { id },
      data: { 
        // ...entity,
        statusId: entityStatusId,
        modifiedById: randModifiedById,
        modifiedAt: dayjs().toDate()
      }
    })

    // await this.prisma.tripTicket.updateMany({
    //   where: { tripId: id },
    //   data:
    //   {
    //     statusId: entityStatusId,
    //   }
    // })

    return await this.prisma.trip.findUnique({ 
      where: { id } ,
      include: { 
        ...this.includes
      }
    });
  }

  async upsertTripTickets(id: number, upsertTripTicketstInput: UpsertTripTicketstInput) {

    const randModifiedById = (Math.floor(Math.random() * 6) + 2)
    // await this.prisma.trip.update({
    //   include: { tripTickets: true },
    //   where: { id },
    //   data: { 
    //     tripTickets:{
    //       connectOrCreate:[
    //         {
    //           create: { 
    //             personId: upsertTripTicketstInput.personId,
    //             cargoId: upsertTripTicketstInput.cargoId,
    //             dependentTripId: upsertTripTicketstInput.dependentTripId,
    //             tripRequestId: upsertTripTicketstInput.tripRequestId,
    //             statusId: 1,
    //             createdById: 1,
    //             createdAt: dayjs().toDate(),
    //             modifiedById: 1,
    //             modifiedAt: dayjs().toDate(),
    //           },
    //           where: {
    //             id: upsertTripTicketstInput.ticketId,
    //           },
    //         }
    //       ]
    //     },
    //   }
    // })


    return await this.prisma.trip.findUnique({ 
      where: { id } ,
      include: { 
        ...this.includes
      }
    });
  }


  async addTicketTrip(addTicketTripInput: AddTripTicketInput)
  {
    // VALIDATIONS
    if((addTicketTripInput.cargo && addTicketTripInput.person) || (!addTicketTripInput.cargo && !addTicketTripInput.person))
    {
      throw new ValidationError("Only Either Cargo or Passenger information must be provided for a ticket");
    }

    const tripEntity = await this.prisma.trip.findUnique({
      where: { id: addTicketTripInput.tripId },
      include: { status: true }
    })

    if(!tripEntity)
    {
      throw new ValidationError(`Trip [ Id: ${ tripEntity.id }] does not exist`)
    }

    if(tripEntity.statusId !== 1)
    {
      throw new ValidationError(`Tickets may only be added to pending trips. Trip [ Id:  ${tripEntity.id} ] status is [ ${tripEntity.status.name} ]`)
    }

    console.log("PERASON", addTicketTripInput.person ? 1: 0)

    const tripEntityNewPeopleCapacityRemaining = tripEntity.peopleCapacityRemaining - (addTicketTripInput.person ? 1 : 0);
    if(addTicketTripInput.person && tripEntityNewPeopleCapacityRemaining < 0)
    {
      throw new ValidationError(`The passenger capacity for this trip [  Id: ${tripEntity.id } ] is full. You can sign up for a waitlist in case of any cancellations.`)
    }
    
    const cargoEntity = await this.prisma.cargo.findUnique({ where: { id: addTicketTripInput.cargo?.id ?? 0}})
    const tripEntityNewCargoWeightCapacityRemaining = tripEntity.cargoWeightCapacityRemaining - (cargoEntity?.cargoWeight ?? 0);
    console.log(tripEntityNewCargoWeightCapacityRemaining);
    if(cargoEntity && tripEntityNewCargoWeightCapacityRemaining < 0)
    {
      throw new ValidationError(`The cargo capacity for this trip [ Id: ${tripEntity.id } ] is exceeded by [ Units: ${ Math.abs(tripEntityNewCargoWeightCapacityRemaining)} ]. You can sign up for a waitlist in case of any cancellations.`)
    }


    // const createPost = await this.prisma.tripTicket.create({
    //   data: {
    //     tripId: 1,
    //     statusId: 1,
    //     createdById: 1,
    //     modifiedById: 1,
    //     person: {
    //       connectOrCreate: {
    //         where: {
    //           id: 1,
    //         },
    //         create: {
    //           name: 'Viola',
    //         },
    //       },
    //     },
    //   },
    //   include: {
    //     person: true,
    //   },
    // })

    return await this.prisma.trip.update({
      where: { id: tripEntity.id },
      data: {
        cargoWeightCapacityRemaining: tripEntityNewCargoWeightCapacityRemaining,
        peopleCapacityRemaining: tripEntityNewPeopleCapacityRemaining,
        tripTickets: {
          // set: { },
          create: {
            personId: addTicketTripInput.person?.id ?? undefined,
            cargoId: addTicketTripInput.cargo?.id  ?? undefined,
            statusId: 1,
            createdById: 1,
            modifiedById: 1
          }
        }
      },
      include: {
        tripTickets: {
          include: {
            person: true,
            cargo: true
          }
        }
      }
    })
  }
}
