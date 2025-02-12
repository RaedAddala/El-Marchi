import { PartialType } from '@nestjs/swagger';
import { CreateRateDto } from './create-rate.dto';

export class UpdateRateDto extends PartialType(CreateRateDto) {}
