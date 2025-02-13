import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

const CreateProductSchema = z.object({
  name: z.string().min(1).max(255),
  brand: z.string().min(1).max(255),
  color: z.string().min(4).max(7),
  description: z.string().min(1),
  price: z.number().positive(),
  size: z.string().min(1).max(50),
  subCategoryId: z.string().uuid(), // Link to SubCategory
  featured: z.boolean().optional(),
  pictures: z.array(z.object({
    publicId: z.string().min(1),
    mimeType: z.string().min(1),
  })).optional(),
  nbInStock: z.number().int().min(0),
  // Optional fields
  material: z.string().optional(),
  sku: z.string().optional(),
  careInstructions: z.string().optional(),
  rating: z.object({
    average: z.number().min(0).max(5),
    count: z.number().min(0),
  }).optional(),
  tags: z.array(z.string()).optional(),
  isOnSale: z.boolean().optional(),
  salePrice: z.number().positive().optional(),
});

export class CreateProductDto extends createZodDto(CreateProductSchema) {}
