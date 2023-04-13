import { Injectable } from '@nestjs/common';
import { CreateTripRequestInput } from './dto/create-trip-request.input';
import { UpdateTripRequestInput } from './dto/update-trip-request.input';
// import { UpdateStatusOfEntityInput } from 'src/status/dto/update-status-of-entity.input';
import { PrismaService } from 'src/services/prisma.service';
import * as dayjs from 'dayjs'
import { ValidationError } from 'apollo-server-express';

@Injectable()
export class TripRequestService {
  constructor(private prisma: PrismaService) {}

  readonly includes = { 
    fromLocation: true,
    toLocation: true,
    // createdBy: true,
    // modifiedBy: true,
    cargoList: true,
    personList: true,
    status: true
  }


  async create(createTripRequestInput: CreateTripRequestInput) {

    // VALIDATION
    if(
      !(
        createTripRequestInput.arriveEarliest
        || createTripRequestInput.arriveLatest
        || createTripRequestInput.departEarliest
        || createTripRequestInput.departLatest
      )
    )
    {
      throw new ValidationError(`At least one time constraint must be provided`)
    }

    const { personList: personListInput, cargoList: cargoListInput, ...restOfInput } = createTripRequestInput;

    let  personListWrites = {
      connect: personListInput?.reduce( (accu, x) => { x.id && accu.push({id: x.id}); return accu }, []),
      create: personListInput?.reduce( (accu, x) => { 
        if(!x.id) {
          const { id: _, ...restOfX } = x;
          accu.push(restOfX); 
        }
        return accu 
      }, [])
    }

    let  cargoListWrites = {
      connect: cargoListInput?.reduce( (accu, x) => { x.id && accu.push({id: x.id}); return accu }, []),
      create: cargoListInput?.reduce( (accu, x) => { 
        if(!x.id) {
          const { id: _, ...restOfX } = x;
          accu.push(restOfX); 
        }
        return accu 
      }, [])
    }

    return await this.prisma.tripRequest.create({
       data: {
        ...restOfInput,
        personList: personListWrites,
        cargoList: cargoListWrites,
        statusId: 1,
        createdById: 1,
        modifiedById: 1,
      },
      include: {
        ...this.includes
      }
    })
  }

  async findAll() {
    return await this.prisma.tripRequest.findMany({
      include: { 
        ...this.includes
      }
    });
  }

  async findOne(id: number) {
    return await this.prisma.tripRequest.findUnique({ 
      where: { id },
      include: { 
        ...this.includes
      }
    })
  }

  // async update(id: number, updateTripRequestInput: UpdateTripRequestInput) {
  //   const {id: entityId, cargoListIds, ...entityDataUpdated} = updateTripRequestInput;
  //   const entity = await this.prisma.tripRequest.findUnique({ where: { id } })
  //   await this.prisma.tripRequest.update({
  //     where: { id },
  //     data: { 
  //       ...entity,
  //       ...entityDataUpdated,
  //       cargoList: 
  //         Array.isArray(cargoListIds)
  //         ? { set: cargoListIds.map(x => ({id: x}))}
  //         : {},
  //       // cargoList: { set: cargoListIds?.map(x => ({id: x})) ?? []},
  //       modifiedById: (Math.floor(Math.random() * 6) + 2),
  //       modifiedAt: dayjs().toDate()
  //     }
  //   })
  //   return await this.prisma.tripRequest.findUnique({ 
  //     where: { id } ,
  //     include: { 
  //       ...this.includes
  //     }
  //   });
  // }

  // async updateStatus(id: number, entityStatusId: number) {
  //   // const entity = await this.prisma.tripRequest.findUnique({ where: { id } })
  //   const randModifiedById = (Math.floor(Math.random() * 6) + 2)
  //   await this.prisma.tripRequest.update({
  //     where: { id },
  //     data: { 
  //       // ...entity,
  //       statusId: entityStatusId,
  //       modifiedById: randModifiedById,
  //       modifiedAt: dayjs().toDate()
  //     }
  //   })

  //   await this.prisma.trip.updateMany({
  //     where: { tripRequestId: id },
  //     data:
  //     {
  //       statusId: entityStatusId,
  //     }
  //   })

  //   await this.prisma.tripTicket.updateMany({
  //     where: { tripRequestId: id },
  //     data:
  //     {
  //       statusId: entityStatusId,
  //     }
  //   })

  //   return await this.prisma.tripRequest.findUnique({ 
  //     where: { id } ,
  //     include: { 
  //       ...this.includes
  //     }
  //   });
  // }

}
