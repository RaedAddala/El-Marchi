import { Injectable } from '@nestjs/common';
import { CreateSellingPointDto } from './dto/create-selling-point.dto';
import { UpdateSellingPointDto } from './dto/update-selling-point.dto';

@Injectable()
export class SellingPointsService {
  create(createSellingPointDto: CreateSellingPointDto) {
    return 'This action adds a new sellingPoint';
  }

  findAll() {
    return `This action returns all sellingPoints`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sellingPoint`;
  }

  update(id: number, updateSellingPointDto: UpdateSellingPointDto) {
    return `This action updates a #${id} sellingPoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} sellingPoint`;
  }
}
