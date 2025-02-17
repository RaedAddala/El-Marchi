import { Module } from '@nestjs/common';
import { OrderitemsService } from './orderitems.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrderitemsService],
})
export class OrdersModule {}
