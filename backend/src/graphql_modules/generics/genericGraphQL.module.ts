import { Module } from '@nestjs/common';
import { genericGraphQL } from './genericGraphQL.service';
// import { LocationService } from './location.service';
// import { LocationResolver } from './location.resolver';
import { PrismaService } from 'src/services/prisma.service';

@Module({
  providers: [PrismaService]
})
export class genericGraphQLModule {}
