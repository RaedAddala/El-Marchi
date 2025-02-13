import {
  Body,
  Controller,
  Delete, Get,
  NotFoundException,
  Param,
  Post, Put,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { extname, join } from 'path';
import { BadRequestException, UseInterceptors } from '@nestjs/common';
import { ProductService } from './products.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Product } from './entities/products.entitiy';
import { unlinkSync } from 'fs';
import {Pagination} from "../common/models/request.model";
import {ProductFilter} from "../common/models/product.model";

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (_req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (_req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<Product> {
    if (!images || images.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    return this.productService.createProduct(createProductDto, images);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.updateProduct(id, updateProductDto);
  }

  @Put(':id/images')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (_req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (_req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
          return callback(new BadRequestException('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async updateProductImages(
    @Param('id') id: string,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    if (!images || images.length === 0) {
      throw new BadRequestException('At least one image is required');
    }

    return this.productService.updateProductImages(id, images);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    const product = await this.productService.findOne(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Delete associated images
    product.pictures.forEach((picture) => {
      const filePath = join(__dirname, '..', 'uploads', 'products', picture.publicId);
      try {
        unlinkSync(filePath); // Delete file
      } catch (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      }
    });

    return this.productService.deleteProduct(id);
  }

  @Get()
  async findAll(@Query() pagination: Pagination) {
    const products = await this.productService.findAll(pagination);

    // Construct image URLs for each product
    const productsWithImageUrls = products.content.map((product) => ({
      ...product,
      pictures: product.pictures.map((picture) => ({
        url: `/uploads/products/${picture.publicId}`,
        mimeType: picture.mimeType,
      })),
    }));

    return productsWithImageUrls;
  }

  @Get('featured')
  async findAllFeatured(@Query() pagination: Pagination) {
    const products = await this.productService.findAllFeatured(pagination);

    // Construct image URLs for each product
    const productsWithImageUrls = products.content.map((product) => ({
      ...product,
      pictures: product.pictures.map((picture) => ({
        url: `/uploads/products/${picture.publicId}`,
        mimeType: picture.mimeType,
      })),
    }));

    return productsWithImageUrls;
  }

  @Get('filter')
  async filterProducts(
    @Query() filter: ProductFilter,
    @Query() pagination: Pagination,
  ) {
    const products = await this.productService.filterProducts(filter, pagination);

    // Construct image URLs for each product
    const productsWithImageUrls = products.content.map((product) => ({
      ...product,
      pictures: product.pictures.map((picture) => ({
        url: `/uploads/products/${picture.publicId}`,
        mimeType: picture.mimeType,
      })),
    }));

    return productsWithImageUrls;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);

    // Construct image URLs
    const images = product.pictures.map((picture) => ({
      url: `/uploads/products/${picture.publicId}`,
      mimeType: picture.mimeType,
    }));

    return {
      ...product,
      pictures: images,
    };
  }
}
