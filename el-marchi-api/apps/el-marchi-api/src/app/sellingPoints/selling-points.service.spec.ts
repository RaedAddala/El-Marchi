import { Test, TestingModule } from '@nestjs/testing';
import { SellingPointsService } from './selling-points.service';

describe('SellingPointsService', () => {
  let service: SellingPointsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellingPointsService],
    }).compile();

    service = module.get<SellingPointsService>(SellingPointsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
