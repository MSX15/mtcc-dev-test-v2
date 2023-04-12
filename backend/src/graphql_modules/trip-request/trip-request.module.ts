import { Module } from '@nestjs/common';
import { TripRequestService } from './trip-request.service';
import { TripRequestResolver } from './trip-request.resolver';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  providers: [TripRequestResolver, TripRequestService, PrismaService]
})
export class TripRequestModule {}
