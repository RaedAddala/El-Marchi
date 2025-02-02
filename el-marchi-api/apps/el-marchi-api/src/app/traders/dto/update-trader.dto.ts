import { PartialType } from '@nestjs/swagger';
import { CreateTraderDto } from './create-trader.dto';

export class UpdateTraderDto extends PartialType(CreateTraderDto) {}
