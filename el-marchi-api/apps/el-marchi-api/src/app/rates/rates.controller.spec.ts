import { Test, TestingModule } from '@nestjs/testing';
import { RatesController } from './rates.controller';
import { RatesService } from './rates.service';

describe('RatesController', () => {
  let controller: RatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatesController],
      providers: [RatesService],
    }).compile();

    controller = module.get<RatesController>(RatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
