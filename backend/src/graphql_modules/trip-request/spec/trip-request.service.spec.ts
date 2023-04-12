import { Test, TestingModule } from '@nestjs/testing';
import { TripRequestService } from '../trip-request.service';

describe('TripRequestService', () => {
  let service: TripRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TripRequestService],
    }).compile();

    service = module.get<TripRequestService>(TripRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
