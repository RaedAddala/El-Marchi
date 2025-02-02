import { Test, TestingModule } from '@nestjs/testing';
import { StockHistoryController } from './stock-history.controller';
import { StockHistoryService } from './stock-history.service';

describe('StockHistoryController', () => {
  let controller: StockHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockHistoryController],
      providers: [StockHistoryService],
    }).compile();

    controller = module.get<StockHistoryController>(StockHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
