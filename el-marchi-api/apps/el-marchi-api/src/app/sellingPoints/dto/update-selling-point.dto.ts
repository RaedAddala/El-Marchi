import { PartialType } from '@nestjs/swagger';
import { CreateSellingPointDto } from './create-selling-point.dto';

export class UpdateSellingPointDto extends PartialType(CreateSellingPointDto) {}
