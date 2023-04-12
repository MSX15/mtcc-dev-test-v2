import { Injectable } from '@nestjs/common';
import { CreatePersonInput } from './dto/create-person.input';
import { UpdatePersonInput } from './dto/update-person.input';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class PersonService {
  constructor(private prisma: PrismaService) {}

  async create(createPersonInput: CreatePersonInput) {
    return await this.prisma.person.create({
       data: { 
        ...createPersonInput
      } 
    })
  }

  findAll() {
    return this.prisma.person.findMany({});
  }

  findOne(id: number) {
    return this.prisma.person.findUnique({ where: { id }})
  }

  update(id: number, updatePersonInput: UpdatePersonInput) {
    return this.prisma.person.update({
      where: { id },
      data: { 
        name: updatePersonInput.name,
        code: updatePersonInput.code
      }
    })
  }

  // remove(id: number) {
  //   return this.prisma.person.delete({
  //     where: { id }
  //   })
  // }
}
