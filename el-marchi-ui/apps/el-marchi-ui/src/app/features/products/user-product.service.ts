import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page, Pagination } from '@shared/models/request.model';
import { Product, ProductCategory, ProductFilter } from '@shared/models/product.model';
import {environment} from "../../../../environments/environment.development";


@Injectable({
  providedIn: 'root',
})
export class UserProductService {

  constructor(private http: HttpClient) {}

  findAllFeaturedProducts(pageRequest: Pagination): Observable<Page<Product>> {
    const params = this.createPaginationParams(pageRequest);
    return this.http.get<Page<Product>>(`${environment.apiUrl}/products/featured`, { params });
  }

  findOneByPublicId(publicId: string): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${publicId}`);
  }

  findRelatedProduct(
    pageRequest: Pagination,
    productPublicId: string,
  ): Observable<Page<Product>> {
    const params = this.createPaginationParams(pageRequest);
    return this.http.get<Page<Product>>(
      `${environment.apiUrl}/products/${productPublicId}/related`,
      { params },
    );
  }

  findAllCategories(): Observable<Page<ProductCategory>> {
    return this.http.get<Page<ProductCategory>>(`${environment.apiUrl}/categories`);
  }

  filter(
    pageRequest: Pagination,
    productFilter: ProductFilter,
  ): Observable<Page<Product>> {
    let params = this.createPaginationParams(pageRequest);

    if (productFilter.category) {
      params = params.set('category', productFilter.category);
    }

    if (productFilter.size) {
      params = params.set('size', productFilter.size);
    }

    return this.http.get<Page<Product>>(`${environment.apiUrl}/products`, { params });
  }

  private createPaginationParams(pagination: Pagination): HttpParams {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('size', pagination.size.toString());

    if (pagination.sort && pagination.sort.length > 0) {
      pagination.sort.forEach((sort) => {
        params = params.append('sort', sort);
      });
    }

    return params;
  }
}
