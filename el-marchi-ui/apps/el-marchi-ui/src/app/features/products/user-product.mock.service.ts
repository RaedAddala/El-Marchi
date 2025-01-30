import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Page, Pagination } from '@shared/models/request.model';
import {
  Product,
  ProductCategory,
  ProductFilter,
} from '@shared/models/product.model';
import { dummyProducts, dummyCategories } from '../../dummyData/products';

@Injectable({
  providedIn: 'root',
})
export class UserProductService {
  findAllFeaturedProducts(pageRequest: Pagination): Observable<Page<Product>> {
    const dummyPage: Page<Product> = {
      content: dummyProducts,
      pageable: {
        pageNumber: pageRequest.page,
        pageSize: pageRequest.size,
        sort: { sorted: true, unsorted: false, empty: false },
        offset: 0,
        paged: true,
        unpaged: false,
      },
      totalElements: dummyProducts.length,
      totalPages: 1,
      last: true,
      size: dummyProducts.length,
      number: pageRequest.page,
      numberOfElements: dummyProducts.length,
      first: true,
      empty: false,
      sort: { sorted: true, unsorted: false, empty: false },
    };

    return of(dummyPage);
  }

  findOneByPublicId(publicId: string): Observable<Product> {
    const product = dummyProducts.find(p => p.publicId === publicId);
    return of(product || dummyProducts[0]); // Return the first product if not found
  }

  findRelatedProduct(
    pageRequest: Pagination,
    productPublicId: string,
  ): Observable<Page<Product>> {
    // Filter related products (for example, exclude the current product)
    const relatedProducts = dummyProducts.filter(
      p => p.publicId !== productPublicId,
    );
    const dummyPage: Page<Product> = {
      content: relatedProducts,
      pageable: {
        pageNumber: pageRequest.page,
        pageSize: pageRequest.size,
        sort: { sorted: true, unsorted: false, empty: false },
        offset: 0,
        paged: true,
        unpaged: false,
      },
      totalElements: relatedProducts.length,
      totalPages: 1,
      last: true,
      size: relatedProducts.length,
      number: pageRequest.page,
      numberOfElements: relatedProducts.length,
      first: true,
      empty: false,
      sort: { sorted: true, unsorted: false, empty: false },
    };

    return of(dummyPage);
  }

  findAllCategories(): Observable<Page<ProductCategory>> {
    const dummyPage: Page<ProductCategory> = {
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
      size: dummyCategories.length,
      number: 0,
      numberOfElements: dummyCategories.length,
      first: true,
      empty: false,
      sort: { sorted: true, unsorted: false, empty: false },
    };

    return of(dummyPage);
  }

  filter(
    pageRequest: Pagination,
    productFilter: ProductFilter,
  ): Observable<Page<Product>> {
    // Apply filters to dummy data
    let filteredProducts = dummyProducts;

    if (productFilter.category) {
      filteredProducts = filteredProducts.filter(
        p => p.category.publicId === productFilter.category,
      );
    }
    //exatcr size for .size spareted by comma
    const sizes = productFilter.size?.split(',');

    if (productFilter.size) {
      filteredProducts = filteredProducts.filter(p => sizes?.includes(p.size));
    }

    const dummyPage: Page<Product> = {
      content: filteredProducts,
      pageable: {
        pageNumber: pageRequest.page,
        pageSize: pageRequest.size,
        sort: { sorted: true, unsorted: false, empty: false },
        offset: 0,
        paged: true,
        unpaged: false,
      },
      totalElements: filteredProducts.length,
      totalPages: 1,
      last: true,
      size: filteredProducts.length,
      number: pageRequest.page,
      numberOfElements: filteredProducts.length,
      first: true,
      empty: false,
      sort: { sorted: true, unsorted: false, empty: false },
    };

    return of(dummyPage);
  }
}
