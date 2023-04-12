import { Injectable } from '@nestjs/common';
import { CreateStatusInput } from './dto/create-status.input';
import { UpdateStatusInput } from './dto/update-status.input';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class StatusService {
  constructor(private prisma: PrismaService) {}

  create(createStatusInput: CreateStatusInput) {
    return 'This action adds a new status';
  }

  findAll() {
    return this.prisma.status.findMany({});

  }

  findOne(id: number) {
    return this.prisma.status.findUnique({ where: { id }})
  }

  update(id: number, updateStatusInput: UpdateStatusInput) {
    return `This action updates a #${id} status`;
  }

  remove(id: number) {
    return `This action removes a #${id} status`;
  }
}
