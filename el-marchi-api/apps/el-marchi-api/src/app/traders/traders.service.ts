import { Injectable } from '@nestjs/common';
import { CreateTraderDto } from './dto/create-trader.dto';
import { UpdateTraderDto } from './dto/update-trader.dto';

@Injectable()
export class TradersService {
  create(createTraderDto: CreateTraderDto) {
    return 'This action adds a new trader';
  }

  findAll() {
    return `This action returns all traders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trader`;
  }

  update(id: number, updateTraderDto: UpdateTraderDto) {
    return `This action updates a #${id} trader`;
  }

  remove(id: number) {
    return `This action removes a #${id} trader`;
  }
}
