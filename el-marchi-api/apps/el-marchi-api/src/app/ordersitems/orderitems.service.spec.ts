import { Test, TestingModule } from '@nestjs/testing';
import { OrderitemsService } from './orderitems.service';

describe('OrderitemsService', () => {
  let service: OrderitemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderitemsService],
    }).compile();

    service = module.get<OrderitemsService>(OrderitemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
