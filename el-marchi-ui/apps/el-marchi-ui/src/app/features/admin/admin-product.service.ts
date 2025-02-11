import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import {catchError, Observable, throwError} from 'rxjs';
import { Page } from '@shared/models/request.model'; // Ensure that the Page type is correctly defined
import { ProductCategory } from '../../shared/models/product.model'; // Ensure ProductCategory model is correct

@Injectable({
  providedIn: 'root',
})
export class AdminProductService {
  http = inject(HttpClient);

  // Create a new category
  createCategory(category: ProductCategory): Observable<ProductCategory> {
    return this.http.post<ProductCategory>(
      `${environment.apiUrl}/categories`,
      category,
    );
  }

  // Delete a category by ID (use params)
  deleteCategory(publicId: string): Observable<void> {
    const params = new HttpParams().set('publicId', publicId);
    return this.http.delete<void>(`${environment.apiUrl}/categories`, { params });
  }

  // Fetch all categories with pagination
  findAllCategories(page: number, size: number): Observable<Page<ProductCategory>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<ProductCategory>>(
      `${environment.apiUrl}/categories`, { params }
    );
  }

  // Fetch subcategories by category ID
  findSubcategoriesByCategoryId(publicId: string): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(
      `${environment.apiUrl}/categories/${publicId}/subcategories`,
    );
  }

  // Create a new subcategory under a specific category
  createSubCategory(categoryId: string, subCategory: { name: string }): Observable<ProductCategory> {
    return this.http.post<ProductCategory>(
      `${environment.apiUrl}/categories/${categoryId}/subcategories`,
      subCategory
    ).pipe(
      catchError((error) => {
        // Handle specific error types, or show a general error message.
        console.error('Error creating subcategory:', error);
        return throwError(error);  // You can handle it better by providing more user-friendly feedback here.
      })
    );
  }

}
