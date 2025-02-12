import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../authentication_authorization/entities/user.entity';
import { Trader } from './entities/trader.entity';
import { TradersController } from './traders.controller';
import { TradersService } from './traders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Trader, User])],
  controllers: [TradersController],
  providers: [TradersService],
})
export class TradersModule {}
