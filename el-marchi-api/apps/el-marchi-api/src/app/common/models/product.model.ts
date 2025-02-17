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
  subCategory: ProductCategory;
  featured: boolean;
  pictures: ProductPicture[];
  nbInStock: number;
}

export interface Product extends BaseProduct {
  publicId: string;
}

export interface ProductFilter {
  filtersize?: string;
  filtercategory?: string | null;
  filtersort: string[];
}

export interface CategoryWithSubcategories extends ProductCategory {
  subcategories?: ProductCategory[];
}
export interface Cart {
  products: CartItem[];
}

export interface CartItem {
  name: string;
  price: number;
  brand: string;
  picture: ProductPicture;
  quantity: number;
  publicId: string;
}
export interface ProductFilterForm {
  size?:
    | {
        [size: string]: boolean;
      }
    | undefined;
  sort: string;
}
