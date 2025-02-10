import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import {SubCategory} from "./entities/subCategory.entity";
import {CreateCategoryDto} from "./dtos/create-category.dto";
import {CreateSubCategoryDto} from "./dtos/create-sub-category.dto";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);

    // Create the default subcategory "Others"
    const subCategory = this.subCategoryRepository.create({
      name: 'Others',
      category,
    });
    await this.subCategoryRepository.save(subCategory);

    return category;
  }

  async createSubCategory(
    createSubCategoryDto: CreateSubCategoryDto,
  ): Promise<SubCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id: createSubCategoryDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createSubCategoryDto.categoryId} not found`,
      );
    }

    const subCategory = this.subCategoryRepository.create({
      name: createSubCategoryDto.name,
      category,
    });
    return this.subCategoryRepository.save(subCategory);
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['subCategories'] });
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
}
