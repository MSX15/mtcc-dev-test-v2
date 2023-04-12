import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { LocationModule } from './graphql_modules/location/location.module';
import { PersonModule } from './graphql_modules/person/person.module';
import { TripModule } from './graphql_modules/trip/trip.module';
import { TripRequestModule } from './graphql_modules/trip-request/trip-request.module';
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: './src/schema.graphql',
    }),
    LocationModule,
    PersonModule,
    // CargoModule,
    // CargoDimensionCategoryModule,
    TripRequestModule,
    // StatusModule,
    TripModule,
    // TripTicketModule,
  ],
  controllers: [],
  providers: [AppService, AppResolver],
})
export class AppModule {}
