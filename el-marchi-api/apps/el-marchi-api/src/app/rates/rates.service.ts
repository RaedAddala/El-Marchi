import { Injectable } from '@nestjs/common';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';

@Injectable()
export class RatesService {
  create(createRateDto: CreateRateDto) {
    return 'This action adds a new rate';
  }

  findAll() {
    return `This action returns all rates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rate`;
  }

  update(id: number, updateRateDto: UpdateRateDto) {
    return `This action updates a #${id} rate`;
  }

  remove(id: number) {
    return `This action removes a #${id} rate`;
  }
}
