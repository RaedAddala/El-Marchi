import { Module } from '@nestjs/common';
import { TradersController } from './traders.controller';
import { TradersService } from './traders.service';

@Module({
  controllers: [TradersController],
  providers: [TradersService],
})
export class TradersModule {}
