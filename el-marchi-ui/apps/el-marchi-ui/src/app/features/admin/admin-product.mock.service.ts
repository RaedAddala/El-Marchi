import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Product,
  ProductCategory,
  BaseProduct,
} from '../../shared/models/product.model';
import { Page, Pagination } from '@shared/models/request.model';
import { dummyCategories, dummyProducts } from '../../dummyData/products';

@Injectable({
  providedIn: 'root',
})
export class AdminProductService {
  // Mock method to create a category
  createCategory(category: ProductCategory): Observable<ProductCategory> {
    const newCategory: ProductCategory = {
      publicId: (dummyCategories.length + 1).toString(),
      ...category,
    };

    dummyCategories.push(newCategory);
    return of(category);
  }

  // Mock method to delete a category
  deleteCategory(publicId: string): Observable<string> {
    // Simulate deleting the category (just returns a success message)
    return of(`Category with publicId ${publicId} deleted successfully.`);
  }

  // Mock method to get all categories
  findAllCategories(): Observable<Page<ProductCategory>> {
    const page: Page<ProductCategory> = {
      content: dummyCategories,
      pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: { sorted: true, unsorted: false, empty: false },
        offset: 0,
        paged: true,
        unpaged: false,
      },
      totalElements: dummyCategories.length,
      totalPages: 1,
      last: true,
      size: 10,
      number: 0,
      numberOfElements: dummyCategories.length,
      first: true,
      empty: false,
      sort: { sorted: true, unsorted: false, empty: false },
    };
    return of(page);
  }

  // Mock method to create a product
  createProduct(product: BaseProduct): Observable<Product> {
    const newProduct: Product = {
      publicId: (dummyProducts.length + 1).toString(),
      ...product,
    };

    dummyProducts.push(newProduct); // Simulate adding the product to the list
    return of(newProduct);
  }

  // Mock method to delete a product
  deleteProduct(publicId: string): Observable<string> {
    const index = dummyProducts.findIndex(
      product => product.publicId === publicId,
    );
    if (index !== -1) {
      dummyProducts.splice(index, 1); // Simulate deleting the product
      return of(`Product with publicId ${publicId} deleted successfully.`);
    }
    return of(`Product with publicId ${publicId} not found.`);
  }

  // Mock method to find all products with pagination
  findAllProducts(pageRequest: Pagination): Observable<Page<Product>> {
    const page: Page<Product> = {
      content: dummyProducts.slice(
        pageRequest.page * pageRequest.size,
        (pageRequest.page + 1) * pageRequest.size,
      ),
      pageable: {
        pageNumber: pageRequest.page,
        pageSize: pageRequest.size,
        sort: { sorted: true, unsorted: false, empty: false },
        offset: pageRequest.page * pageRequest.size,
        paged: true,
        unpaged: false,
      },
      totalElements: dummyProducts.length,
      totalPages: Math.ceil(dummyProducts.length / pageRequest.size),
      last:
        pageRequest.page ===
        Math.ceil(dummyProducts.length / pageRequest.size) - 1,
      size: pageRequest.size,
      number: pageRequest.page,
      numberOfElements: pageRequest.size,
      first: pageRequest.page === 0,
      empty: dummyProducts.length === 0,
      sort: { sorted: true, unsorted: false, empty: false },
    };
    return of(page);
  }

  createSubCategory(categoryId: string, subCategoryToCreate: { name: string }): Observable<ProductCategory> {
    return of({
      publicId: '1',
      name: subCategoryToCreate.name,
      category: {
        publicId: categoryId,
        name: 'Category',
      },
    });

  }


}
