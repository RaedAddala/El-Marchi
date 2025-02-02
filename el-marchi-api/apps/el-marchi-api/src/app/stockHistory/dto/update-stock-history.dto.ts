import { PartialType } from '@nestjs/swagger';
import { CreateStockHistoryDto } from './create-stock-history.dto';

export class UpdateStockHistoryDto extends PartialType(CreateStockHistoryDto) {}
