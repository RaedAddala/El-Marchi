import { Module } from '@nestjs/common';
import { TradersController } from './traders.controller';
import { TradersService } from './traders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trader } from './entities/trader.entity';
import { User } from '../authentication_authorization/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trader, User])],
  controllers: [TradersController],
  providers: [TradersService],
})
export class TradersModule { }
