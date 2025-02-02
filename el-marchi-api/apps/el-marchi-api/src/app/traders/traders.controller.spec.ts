import { Test, TestingModule } from '@nestjs/testing';
import { TradersController } from './traders.controller';
import { TradersService } from './traders.service';

describe('TradersController', () => {
  let controller: TradersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TradersController],
      providers: [TradersService],
    }).compile();

    controller = module.get<TradersController>(TradersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
