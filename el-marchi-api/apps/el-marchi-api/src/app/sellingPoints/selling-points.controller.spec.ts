import { Test, TestingModule } from '@nestjs/testing';
import { SellingPointsController } from './selling-points.controller';
import { SellingPointsService } from './selling-points.service';

describe('SellingPointsController', () => {
  let controller: SellingPointsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellingPointsController],
      providers: [SellingPointsService],
    }).compile();

    controller = module.get<SellingPointsController>(SellingPointsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
