import { Test, TestingModule } from '@nestjs/testing';
import { StockHistoryService } from './stock-history.service';

describe('StockHistoryService', () => {
  let service: StockHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockHistoryService],
    }).compile();

    service = module.get<StockHistoryService>(StockHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
