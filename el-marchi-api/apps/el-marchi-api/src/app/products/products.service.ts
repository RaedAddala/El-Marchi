import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { SubCategory } from '../categories/entities/subCategory.entity';
import { Product } from './entities/products.entitiy';
import { Page, Pagination } from '../common/models/request.model';
import { ProductFilter } from '../common/models/product.model';
import {join} from "path";
import {unlinkSync} from "fs";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async createProduct(createProductDto: CreateProductDto, images: Express.Multer.File[]): Promise<Product> {
    const imagePaths = images.map((image) => ({
      publicId: image.filename,
      mimeType: image.mimetype,
    }));

    const subCategory = await this.subCategoryRepository.findOne({
      where: { id: createProductDto.subCategoryId },
    });

    if (!subCategory) {
      throw new BadRequestException('Invalid sub-category');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      pictures: imagePaths,
      subCategory,
    });

    return this.productRepository.save(product);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = this.productRepository.merge(product, updateProductDto);
    return this.productRepository.save(updatedProduct);
  }

  async deleteProduct(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Product not found');
    }
  }

  async findAll(pagination: Pagination): Promise<Page<Product>> {
    const [results, total] = await this.productRepository.findAndCount({
      relations: ['subCategory', 'subCategory.category'],
      take: pagination.size,
      skip: pagination.page * pagination.size,
    });

    return this.createPageResponse(results, total, pagination);
  }

  async findAllFeatured(pagination: Pagination): Promise<Page<Product>> {
    const [results, total] = await this.productRepository.findAndCount({
      where: { featured: true },
      relations: ['subCategory', 'subCategory.category'],
      take: pagination.size,
      skip: pagination.page * pagination.size,
    });

    return this.createPageResponse(results, total, pagination);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['subCategory', 'subCategory.category'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async filterProducts(filter: ProductFilter, pagination: Pagination): Promise<Page<Product>> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.category', 'category');

    if (filter.category) {
      query.andWhere('category.id = :categoryId', { categoryId: filter.category });
    }

    if (filter.size) {
      const sizes = filter.size.split(',');
      query.andWhere('product.size IN (:...sizes)', { sizes });
    }

    const [results, total] = await query
      .take(pagination.size)
      .skip(pagination.page * pagination.size)
      .getManyAndCount();

    return this.createPageResponse(results, total, pagination);
  }

  private createPageResponse(
    content: Product[],
    total: number,
    pagination: Pagination,
  ): Page<Product> {
    return {
      content,
      totalElements: total,
      totalPages: total > 0 ? Math.ceil(total / pagination.size) : 1,
      pageable: {
        pageNumber: pagination.page,
        pageSize: pagination.size,
        sort: { sorted: true, unsorted: false, empty: false },
        offset: pagination.page * pagination.size,
        paged: true,
        unpaged: false,
      },
      last: pagination.page >= Math.ceil(total / pagination.size) - 1,
      size: pagination.size,
      number: pagination.page,
      numberOfElements: content.length,
      first: pagination.page === 0,
      empty: content.length === 0,
      sort: { sorted: true, unsorted: false, empty: false },
    };
  }

  async updateProductImages(id: string, images: Express.Multer.File[]): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Delete old images from the file system
    product.pictures.forEach((picture) => {
      const filePath = join(__dirname, '..', 'uploads', 'products', picture.publicId);
      try {
        unlinkSync(filePath); // Delete file
      } catch (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      }
    });

    // Process new images
    const imagePaths = images.map((image) => ({
      publicId: image.filename,
      mimeType: image.mimetype,
    }));

    // Update product's images
    product.pictures = imagePaths;
    return this.productRepository.save(product);
  }
}
