import { Test, TestingModule } from '@nestjs/testing';
import { TripResolver } from '../trip.resolver';
import { TripService } from '../trip.service';

describe('TripResolver', () => {
  let resolver: TripResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripResolver, TripService],
    }).compile();

    resolver = module.get<TripResolver>(TripResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
