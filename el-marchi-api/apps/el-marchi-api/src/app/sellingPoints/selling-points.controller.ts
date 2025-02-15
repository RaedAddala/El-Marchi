import { Controller } from '@nestjs/common';
import { SellingPointsService } from './selling-points.service';

@Controller('selling-points')
export class SellingPointsController {
  constructor(private readonly sellingPointsService: SellingPointsService) {}
}
