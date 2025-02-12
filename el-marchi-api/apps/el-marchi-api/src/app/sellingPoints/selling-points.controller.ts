import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSellingPointDto } from './dto/create-selling-point.dto';
import { UpdateSellingPointDto } from './dto/update-selling-point.dto';
import { SellingPointsService } from './selling-points.service';

@Controller('selling-points')
export class SellingPointsController {
  constructor(private readonly sellingPointsService: SellingPointsService) {}

  @Post()
  create(@Body() createSellingPointDto: CreateSellingPointDto) {
    return this.sellingPointsService.create(createSellingPointDto);
  }

  @Get()
  findAll() {
    return this.sellingPointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellingPointsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSellingPointDto: UpdateSellingPointDto,
  ) {
    return this.sellingPointsService.update(+id, updateSellingPointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellingPointsService.remove(+id);
  }
}
