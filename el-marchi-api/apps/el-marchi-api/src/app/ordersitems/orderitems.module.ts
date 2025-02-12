import { Module } from '@nestjs/common';
import { OrderitemsController } from './orderitems.controller';
import { OrderitemsService } from './orderitems.service';

@Module({
  controllers: [OrderitemsController],
  providers: [OrderitemsService],
})
export class OrderitemsModule {}
