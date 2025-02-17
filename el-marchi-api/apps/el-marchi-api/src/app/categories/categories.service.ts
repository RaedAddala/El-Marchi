import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CategoryWithSubcategories,
  ProductCategory,
} from '../common/models/product.model';
import { Page, Pageable } from '../common/models/request.model';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/subCategory.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryWithSubcategories> {
    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);

    const subCategory: SubCategory = this.subCategoryRepository.create({
      name: 'Others',
      category,
    });
    await this.subCategoryRepository.save(subCategory);

    const cat: CategoryWithSubcategories = {
      publicId: category.id,
      name: category.name,
      subcategories: [{ publicId: subCategory.id, name: subCategory.name }],
    };
    return cat;
  }

  async createSubCategory(
    categoryId: string,
    name: string,
  ): Promise<SubCategory> {
    // Find the category by its ID from the request DTO.
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    const subCategory = this.subCategoryRepository.create({
      name: name,
      category,
    });

    return this.subCategoryRepository.save(subCategory);
  }

  async findAllCategories(pageable: Pageable): Promise<Page<ProductCategory>> {
    const [categories, total] = await this.categoryRepository.findAndCount({
      relations: ['subCategories'],
      skip: pageable.pageNumber * pageable.pageSize,
      take: pageable.pageSize,
      order: pageable.sort.sorted
        ? { [pageable.sort.unsorted ? 'ASC' : 'DESC']: pageable.sort.sorted }
        : {},
    });
    const productCategories = categories.map(category => ({
      publicId: category.id,
      name: category.name,
      subcategories: category.subCategories.map(subCategory => ({
        publicId: subCategory.id,
        name: subCategory.name,
      })),
    }));
    return {
      content: productCategories,
      pageable,
      totalElements: total,
      totalPages: Math.ceil(total / pageable.pageSize),
      last: pageable.pageNumber + 1 >= Math.ceil(total / pageable.pageSize),
      size: pageable.pageSize,
      number: pageable.pageNumber,
      numberOfElements: categories.length,
      first: pageable.pageNumber === 0,
      empty: categories.length === 0,
      sort: pageable.sort,
    };
  }

  async findCategoryById(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['subCategories'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async deleteCategory(categoryId: string) {
    return this.categoryRepository.delete(categoryId);
  }

  async deleteSubCategory(subCategoryId: string) {
    return this.subCategoryRepository.delete(subCategoryId);
  }
}
