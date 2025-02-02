import { Module } from '@nestjs/common';
import { SellingPointsController } from './selling-points.controller';
import { SellingPointsService } from './selling-points.service';

@Module({
  controllers: [SellingPointsController],
  providers: [SellingPointsService],
})
export class SellingPointsModule {}
