import { Injectable, NotFoundException } from '@nestjs/common';
import {Page, Pageable} from "../common/models/request.model";
import { InjectRepository } from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/subCategory.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CreateSubCategoryDto } from './dtos/create-sub-category.dto';
import {CategoryWithSubcategories, ProductCategory} from "../common/models/product.model";


@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryWithSubcategories> {
    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);

    const subCategory:SubCategory = this.subCategoryRepository.create({
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

  async createSubCategory(createSubCategoryDto: CreateSubCategoryDto): Promise<SubCategory> {
    // Find the category by its ID from the request DTO.
    const category = await this.categoryRepository.findOne({
      where: { id: createSubCategoryDto.categoryId },
    });

    // If category does not exist, throw a NotFoundException.
    if (!category) {
      throw new NotFoundException(`Category with ID ${createSubCategoryDto.categoryId} not found`);
    }

    // Create and save the subcategory within the given category.
    const subCategory = this.subCategoryRepository.create({
      name: createSubCategoryDto.name,
      category,
    });

    // Save the subcategory to the database and return the created subcategory.
    return this.subCategoryRepository.save(subCategory);
  }


  async findAllCategories(pageable: Pageable): Promise<Page<ProductCategory>> {
    const [categories, total] = await this.categoryRepository.findAndCount({
      relations: ['subCategories'],
      skip: pageable.pageNumber * pageable.pageSize,
      take: pageable.pageSize,
      order: (pageable.sort.sorted ? { [pageable.sort.unsorted ? 'ASC' : 'DESC']: pageable.sort.sorted } : {}),
    });
    const productCategories = categories.map(category => ({
      publicId: category.id,
      name: category.name,
      subcategories: category.subCategories.map(subCategory => ({ publicId: subCategory.id, name: subCategory.name })),
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
    const category = await this.categoryRepository.findOne({ where: { id }, relations: ['subCategories'] });

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
