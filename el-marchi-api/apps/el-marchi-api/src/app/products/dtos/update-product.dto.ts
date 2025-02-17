import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

const UpdateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  brand: z.string().min(1).max(255).optional(),
  color: z.string().min(4).max(7).optional(),
  description: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  size: z.string().min(1).max(50).optional(),
  subCategoryId: z.string().uuid().optional(), // Link to SubCategory
  featured: z.boolean().optional(),
  nbInStock: z.number().int().min(0).optional(),

  material: z.string().optional(),
  sku: z.string().optional(),
  careInstructions: z.string().optional(),
  rating: z
    .object({
      average: z.number().min(0).max(5),
      count: z.number().min(0),
    })
    .optional(),
  tags: z.array(z.string()).optional(),
  isOnSale: z.boolean().optional(),
  salePrice: z.number().positive().optional(),
});

export class UpdateProductDto extends createZodDto(UpdateProductSchema) {}
