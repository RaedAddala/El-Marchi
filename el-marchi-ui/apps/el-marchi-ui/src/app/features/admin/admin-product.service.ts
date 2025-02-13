import { inject, Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import {catchError, Observable, throwError} from 'rxjs';
import {Page, Pagination} from '@shared/models/request.model'; // Ensure that the Page type is correctly defined
import {BaseProduct, Product, ProductCategory} from '../../shared/models/product.model'; // Ensure ProductCategory model is correct

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
    //verify that the categoryId is correctly added to the subCategory object before passing to the service
    return this.http.post<ProductCategory>(
      `${environment.apiUrl}/categories/${categoryId}/subcategories`,

      subCategory//subCategory here is the body ? answer is yes it is
    ).pipe(
      catchError((error) => {
        // Handle specific error types, or show a general error message.
        console.error('Error creating subcategory:', error);
        return throwError(error);  // You can handle it better by providing more user-friendly feedback here.
      })
    );
  }

  createProduct(product: BaseProduct, images: File[]): Observable<Product> {
    const formData = new FormData();

    // Append product data as individual fields
    formData.append('name', product.name);
    formData.append('brand', product.brand);
    formData.append('color', product.color);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('size', product.size);
    formData.append('category', JSON.stringify(product.category)); // Append category as JSON
    formData.append('featured', product.featured.toString());
    formData.append('nbInStock', product.nbInStock.toString());

    // Append each image file
    images.forEach((image) => {
      formData.append('images', image, image.name); // Use 'images' as the field name
    });

    // Send the request
    return this.http.post<Product>(`${environment.apiUrl}/products`, formData);
  }

  deleteProduct(publicId: string): Observable<string> {
    return this.http.delete<string>(`${environment.apiUrl}/products/${publicId}`);
  }

  findAllProducts(pageRequest: Pagination): Observable<Page<Product>> {
    const params = {
      page: pageRequest.page.toString(),
      size: pageRequest.size.toString(),
    };
    return this.http.get<Page<Product>>(`${environment.apiUrl}/products`, { params });
  }

}
