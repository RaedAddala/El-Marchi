import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Page,
  Pagination,
  createPaginationOption,
} from '@shared/models/request.model';
import { Product, ProductFilter } from '@shared/models/product.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserProductService {
  private readonly baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  // Find all featured products with pagination
  findAllFeaturedProducts(pageRequest: Pagination): Observable<Page<Product>> {
    const params = createPaginationOption(pageRequest);
    return this.http.get<Page<Product>>(`${this.baseUrl}/featured`, { params });
  }

  // Find a product by publicId
  findOneByPublicId(publicId: string): Observable<Product> {
    console.log('searching for product with publicId: ', publicId);
    return this.http.get<Product>(`${this.baseUrl}/${publicId}`);
  }

  // Find related products based on pagination and product public ID
  findRelatedProduct(
    pageRequest: Pagination,
    productPublicId: string,
  ): Observable<Page<Product>> {
    const params = createPaginationOption(pageRequest);
    return this.http.get<Page<Product>>(
      `${this.baseUrl}/${productPublicId}/related`,
      { params },
    );
  }

  // Filter products based on pagination and filter criteria
  filter(
    pageRequest: Pagination,
    productFilter: ProductFilter,
  ): Observable<Page<Product>> {
    let params = createPaginationOption(pageRequest);
    console.log('productFilter', productFilter);
    if (productFilter.filtersize && productFilter.filtersize.length > 0) {
      params = params.set('filtersize', productFilter.filtersize);
    }

    for (const sort of productFilter.filtersort) {
      params = params.append('filtersort', sort.trim());
    }
    console.log('params', params);
    return this.http.get<Page<Product>>(`${this.baseUrl}/filter`, { params });
  }
}
