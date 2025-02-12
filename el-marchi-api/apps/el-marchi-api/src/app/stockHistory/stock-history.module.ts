import { Module } from '@nestjs/common';
import { StockHistoryController } from './stock-history.controller';
import { StockHistoryService } from './stock-history.service';

@Module({
  controllers: [StockHistoryController],
  providers: [StockHistoryService],
})
export class StockHistoryModule {}
