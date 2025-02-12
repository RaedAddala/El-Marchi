import { Test, TestingModule } from '@nestjs/testing';
import { TradersService } from './traders.service';

describe('TradersService', () => {
  let service: TradersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TradersService],
    }).compile();

    service = module.get<TradersService>(TradersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
