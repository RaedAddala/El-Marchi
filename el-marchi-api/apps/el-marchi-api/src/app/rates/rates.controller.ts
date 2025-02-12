import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { RatesService } from './rates.service';

@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Post()
  create(@Body() createRateDto: CreateRateDto) {
    return this.ratesService.create(createRateDto);
  }

  @Get()
  findAll() {
    return this.ratesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRateDto: UpdateRateDto) {
    return this.ratesService.update(+id, updateRateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ratesService.remove(+id);
  }
}
