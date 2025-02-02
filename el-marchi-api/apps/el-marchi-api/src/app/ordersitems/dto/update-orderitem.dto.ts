import { PartialType } from '@nestjs/swagger';
import { CreateOrderitemDto } from './create-orderitem.dto';

export class UpdateOrderitemDto extends PartialType(CreateOrderitemDto) {}
