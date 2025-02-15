import { Controller } from '@nestjs/common';
import { OrderitemsService } from './orderitems.service';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderItemsService: OrderitemsService,
  ) {}
}
