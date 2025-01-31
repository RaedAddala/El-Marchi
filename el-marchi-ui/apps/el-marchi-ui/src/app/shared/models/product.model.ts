import { FormControl, FormRecord } from '@angular/forms';

export type ProductSizes =
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'XXL'
  | 'XXXL'
  | string;
export const sizes: ProductSizes[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export interface ProductCategory {
  publicId?: string;
  name?: string;
}

export interface ProductPicture {
  publicId: string;
  mimeType: string;
}

export interface ProductRating {
  average: number;
  count: number;
}

export interface BaseProduct {
  brand: string;
  color: string;
  description: string;
  name: string;
  material?: string;
  sku?: string;
  careInstructions?: string;
  rating?: ProductRating;
  price: number;
  salePrice?: number;
  tags?: string[];
  isOnSale?: boolean;
  size: ProductSizes;
  category: ProductCategory;
  featured: boolean;
  pictures: ProductPicture[];
  nbInStock: number;
}

export interface Product extends BaseProduct {
  publicId: string;
}

export type CreateCategoryFormContent = {
  name: FormControl<string>;
};

export type CreateProductFormContent = {
  brand: FormControl<string>;
  color: FormControl<string>;
  description: FormControl<string>;
  name: FormControl<string>;
  price: FormControl<number>;
  size: FormControl<ProductSizes>;
  category: FormControl<string>;
  featured: FormControl<boolean>;
  pictures: FormControl<ProductPicture[]>;
  stock: FormControl<number>;
};

export interface ProductFilter {
  size?: string;
  category?: string | null;
  sort: string[];
}

export type FilterProductsFormContent = {
  sort: FormControl<string>;
  size: FormRecord<FormControl<boolean>>;
};

export interface ProductFilterForm {
  size?:
    | {
        [size: string]: boolean;
      }
    | undefined;
  sort: string;
}
