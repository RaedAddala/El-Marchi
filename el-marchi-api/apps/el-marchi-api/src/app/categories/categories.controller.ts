import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CreateSubCategoryDto } from './dtos/create-sub-category.dto';
import { Pageable } from '../common/models/request.model';
import { CategoryWithSubcategories } from '../common/models/product.model';
import * as console from "node:console";

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Create a new category
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryWithSubcategories> {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  // Create a new subcategory under a specific category
  @Post(':id/subcategories')
  createSubCategory(
    @Param('id') categoryId: string,  // Extract categoryId from the URL parameter.
    @Body() createSubCategoryDto: CreateSubCategoryDto,  // DTO containing subcategory details.
  ) {
    console.log('###############################################################');
    console.log('createSubCategoryDto', createSubCategoryDto);
    console.log('###############################################################');
    // Ensure the categoryId is correctly added to the DTO before passing to service.
    createSubCategoryDto.categoryId = categoryId;

    return this.categoriesService.createSubCategory(createSubCategoryDto);  // Call the service to handle creation.
  }


  // Delete a category by ID
  @Delete(':id')
  async deleteCategory(@Param('id') categoryId: string) {
    const result = await this.categoriesService.deleteCategory(categoryId);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
    return { message: 'Category deleted successfully' };
  }

  // Delete a subcategory by subcategory ID
  @Delete(':id/subcategories/:subId')
  async deleteSubCategory(@Param('subId') subCategoryId: string) {
    const result = await this.categoriesService.deleteSubCategory(subCategoryId);
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
    return category.subCategories; // Return all subcategories of the category
  }
}
