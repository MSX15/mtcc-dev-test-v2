import { Test, TestingModule } from '@nestjs/testing';
import { TripRequestResolver } from './trip-request.resolver';
import { TripRequestService } from './trip-request.service';

describe('TripRequestResolver', () => {
  let resolver: TripRequestResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripRequestResolver, TripRequestService],
    }).compile();

    resolver = module.get<TripRequestResolver>(TripRequestResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
