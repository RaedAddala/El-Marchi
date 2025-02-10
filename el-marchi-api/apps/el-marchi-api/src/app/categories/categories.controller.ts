import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {CategoriesService} from "./categories.service";
import {CreateCategoryDto} from "./dtos/create-category.dto";
import {CreateSubCategoryDto} from "./dtos/create-sub-category.dto";


@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  //here we should use a guard to check if the user has the right to create a category
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }
  //here we should use a guard to check if the user has the right to create a subcategory
  @Post(':id/subcategories')
  createSubCategory(
    @Param('id') categoryId: string,
    @Body() createSubCategoryDto: CreateSubCategoryDto,
  ) {
    createSubCategoryDto.categoryId = categoryId;
    return this.categoriesService.createSubCategory(createSubCategoryDto);
  }

  @Get()
  findAllCategories() {
    return this.categoriesService.findAllCategories();
  }

  @Get(':id')
  async findCategoryById(@Param('id') id: string) {
    const category = await this.categoriesService.findCategoryById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }
}
