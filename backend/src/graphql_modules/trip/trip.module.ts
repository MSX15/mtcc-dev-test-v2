import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripResolver } from './trip.resolver';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  providers: [TripResolver, TripService, PrismaService]
})
export class TripModule {}
