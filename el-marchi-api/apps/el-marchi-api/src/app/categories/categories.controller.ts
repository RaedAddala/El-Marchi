import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CategoryWithSubcategories } from '../common/models/product.model';
import { Pageable } from '../common/models/request.model';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CreateSubCategoryDto } from './dtos/create-sub-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryWithSubcategories> {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  // Create a new subcategory under a specific category
  @Post(':id/subcategories')
  createSubCategory(
    @Param('id') categoryId: string,
    @Body() createSubCategoryDto: CreateSubCategoryDto,
  ) {
    return this.categoriesService.createSubCategory(
      categoryId,
      createSubCategoryDto.name,
    );
  }

  // Delete a category by ID
  @Delete('')
  async deleteCategory(@Query('publicId') categoryId: string) {
    const result = await this.categoriesService.deleteCategory(categoryId);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
    return { message: 'Category deleted successfully' };
  }

  // Delete a subcategory by subcategory ID
  @Delete(':id/subcategories/:subId')
  async deleteSubCategory(@Param('subId') subCategoryId: string) {
    const result = await this.categoriesService.deleteSubCategory(
      subCategoryId,
    );
    if (result.affected === 0) {
      throw new NotFoundException(
        `SubCategory with ID ${subCategoryId} not found`,
      );
    }
    return { message: 'SubCategory deleted successfully' };
  }

  // Fetch all categories with pagination
  @Get()
  findAllCategories(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('sort') sort: string,
  ) {
    const pageable: Pageable = {
      pageNumber: page || 0,
      pageSize: size || 10,
      sort: {
        sorted: !!sort,
        unsorted: !sort,
        empty: !sort,
      },
      offset: (page || 0) * (size || 10),
      paged: true,
      unpaged: false,
    };

    return this.categoriesService.findAllCategories(pageable);
  }

  // Fetch a category by its ID
  @Get(':id')
  async findCategoryById(@Param('id') id: string) {
    const category = await this.categoriesService.findCategoryById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  // Fetch subcategories by category ID
  @Get(':id/subcategories')
  async findSubcategoriesByCategoryId(@Param('id') id: string) {
    const category = await this.categoriesService.findCategoryById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category.subCategories;
  }
}
