import { Injectable } from '@nestjs/common';
import { CreateOrderitemDto } from './dto/create-orderitem.dto';
import { UpdateOrderitemDto } from './dto/update-orderitem.dto';

@Injectable()
export class OrderitemsService {
  create(createOrderitemDto: CreateOrderitemDto) {
    return 'This action adds a new orderitem';
  }

  findAll() {
    return `This action returns all orderitems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderitem`;
  }

  update(id: number, updateOrderitemDto: UpdateOrderitemDto) {
    return `This action updates a #${id} orderitem`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderitem`;
  }
}
