import { Module } from '@nestjs/common';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';

@Module({
  controllers: [DiscountsController],
  providers: [DiscountsService],
})
export class DiscountsModule {}
