import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Category} from "./entities/category.entity";
import {SubCategory} from "./entities/subCategory.entity";
import {CategoriesController} from "./categories.controller";
import {CategoriesService} from "./categories.service";

@Module({
  imports: [TypeOrmModule.forFeature([Category, SubCategory])], // Register entities
  controllers: [CategoriesController], // Register controller
  providers: [CategoriesService], // Register service
})
export class CategoriesModule {}
