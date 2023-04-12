import { Injectable } from '@nestjs/common';
import { CreateLocationInput } from './dto/create-location.input';
import { UpdateLocationInput } from './dto/update-location.input';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class LocationService {
  constructor(private prisma: PrismaService) {}

  async create(createLocationInput: CreateLocationInput) {

    console.log("Data", createLocationInput )
    // return await this.prisma.location.create({ data: { name: createLocationInput.name } })
    return await this.prisma.location.create({ data: { ...createLocationInput } })
    // return 'This action adds a new location';
  }

  findAll() {
    return this.prisma.location.findMany({ where: { isDeleted: false }});
    // return `This action returns all location`;
  }

  findOne(id: number) {
    return this.prisma.location.findUnique({ where: { id }})
    // return `This action returns a #${id} location`;
  }

  update(id: number, updateLocationInput: UpdateLocationInput) {
    return this.prisma.location.update({
      where: { id },
      // if null => mapTo => undefined if you want to not do anything on update
      data: { name: updateLocationInput.name }
    })
    // return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return this.prisma.location.update({
      where: { id },
      data: { isDeleted: true }
    })
    // return this.prisma.location.delete({ where: { id }})
    // return `This action removes a #${id} location`;
  }
}
