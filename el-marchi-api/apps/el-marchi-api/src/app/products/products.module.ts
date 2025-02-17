import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ProductController} from "./products.controller";
import {ProductService} from "./products.service";
import {SubCategory} from "../categories/entities/subCategory.entity";
import {Product} from "./entities/products.entitiy";


@Module({
  imports: [TypeOrmModule.forFeature([Product, SubCategory])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
